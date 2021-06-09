"use strict";
/*
 * Copyright 2015-2016 Imply Data, Inc.
 * Copyright 2017-2019 Allegro.pl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Essence = exports.VisStrategy = void 0;
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const functional_1 = require("../../utils/functional/functional");
const nullable_equals_1 = __importDefault(require("../../utils/immutable-utils/nullable-equals"));
const visualization_independent_evaluator_1 = require("../../utils/rules/visualization-independent-evaluator");
const date_range_1 = require("../date-range/date-range");
const filter_clause_1 = require("../filter-clause/filter-clause");
const series_list_1 = require("../series-list/series-list");
const concrete_series_1 = require("../series/concrete-series");
const create_concrete_series_1 = __importDefault(require("../series/create-concrete-series"));
const sort_on_1 = require("../sort-on/sort-on");
const sort_1 = require("../sort/sort");
const splits_1 = require("../splits/splits");
const time_shift_1 = require("../time-shift/time-shift");
const time_shift_env_1 = require("../time-shift/time-shift-env");
const visualization_manifest_1 = require("../visualization-manifest/visualization-manifest");
function constrainDimensions(dimensions, dataCube) {
    return dimensions.filter(dimensionName => Boolean(dataCube.getDimension(dimensionName)));
}
/**
 * FairGame   - Run all visualizations pretending that there is no current
 * UnfairGame - Run all visualizations but mark current vis as current
 * KeepAlways - Just keep the current one
 */
var VisStrategy;
(function (VisStrategy) {
    VisStrategy[VisStrategy["FairGame"] = 0] = "FairGame";
    VisStrategy[VisStrategy["UnfairGame"] = 1] = "UnfairGame";
    VisStrategy[VisStrategy["KeepAlways"] = 2] = "KeepAlways";
})(VisStrategy = exports.VisStrategy || (exports.VisStrategy = {}));
const defaultEssence = {
    dataCube: null,
    visualization: null,
    visualizationSettings: null,
    timezone: chronoshift_1.Timezone.UTC,
    filter: null,
    splits: null,
    series: null,
    pinnedDimensions: immutable_1.OrderedSet([]),
    pinnedSort: null,
    timeShift: time_shift_1.TimeShift.empty(),
    visResolve: null
};
function resolveVisualization({ visualization, dataCube, splits, series }) {
    let visResolve;
    // Place vis here because it needs to know about splits and colors (and maybe later other things)
    if (!visualization) {
        const visAndResolve = Essence.getBestVisualization(dataCube, splits, series, null);
        visualization = visAndResolve.visualization;
    }
    const ruleVariables = { dataCube, series, splits, isSelectedVisualization: true };
    visResolve = visualization.evaluateRules(ruleVariables);
    if (visResolve.isAutomatic()) {
        const adjustment = visResolve.adjustment;
        splits = adjustment.splits;
        visResolve = visualization.evaluateRules(Object.assign(Object.assign({}, ruleVariables), { splits }));
        if (!visResolve.isReady()) {
            throw new Error(visualization.title + " must be ready after automatic adjustment");
        }
    }
    if (visResolve.isReady()) {
        visResolve = visualization_independent_evaluator_1.visualizationIndependentEvaluator({ dataCube, series });
    }
    return { visualization, splits, visResolve };
}
class Essence extends immutable_1.Record(defaultEssence) {
    constructor(parameters) {
        const { filter, dataCube, timezone, timeShift, series, pinnedDimensions, pinnedSort } = parameters;
        if (!dataCube)
            throw new Error("Essence must have a dataCube");
        const { visResolve, visualization, splits } = resolveVisualization(parameters);
        const constrainedSeries = series && series.constrainToMeasures(dataCube.measures);
        const isPinnedSortValid = series && constrainedSeries.hasMeasureSeries(pinnedSort);
        const constrainedPinnedSort = isPinnedSortValid ? pinnedSort : Essence.defaultSortReference(constrainedSeries, dataCube);
        const constrainedFilter = filter.constrainToDimensions(dataCube.dimensions);
        const validTimezone = timezone || chronoshift_1.Timezone.UTC;
        const timeFilter = Essence.timeFilter(filter, dataCube);
        const constrainedTimeShift = timeShift.constrainToFilter(timeFilter, validTimezone);
        super(Object.assign(Object.assign({}, parameters), { dataCube,
            visualization, timezone: validTimezone, timeShift: constrainedTimeShift, splits: splits && splits.constrainToDimensionsAndSeries(dataCube.dimensions, constrainedSeries), filter: constrainedFilter, series: constrainedSeries, pinnedDimensions: constrainDimensions(pinnedDimensions, dataCube), pinnedSort: constrainedPinnedSort, visResolve }));
    }
    static getBestVisualization(dataCube, splits, series, currentVisualization) {
        ///@ts-ignore
        const visAndResolves = MANIFESTS.map(visualization => {
            const isSelectedVisualization = visualization === currentVisualization;
            const ruleVariables = { dataCube, splits, series, isSelectedVisualization };
            return {
                visualization,
                resolve: visualization.evaluateRules(ruleVariables)
            };
        });
        return visAndResolves.sort((vr1, vr2) => visualization_manifest_1.Resolve.compare(vr1.resolve, vr2.resolve))[0];
    }
    static fromDataCube(dataCube) {
        const essence = new Essence({
            dataCube,
            visualization: null,
            visualizationSettings: null,
            timezone: dataCube.getDefaultTimezone(),
            filter: dataCube.getDefaultFilter(),
            timeShift: time_shift_1.TimeShift.empty(),
            splits: dataCube.getDefaultSplits(),
            series: series_list_1.SeriesList.fromMeasureNames(dataCube.getDefaultSelectedMeasures().toArray()),
            pinnedDimensions: dataCube.getDefaultPinnedDimensions(),
            pinnedSort: dataCube.getDefaultSortMeasure()
        });
        return essence.updateSplitsWithFilter();
    }
    static defaultSortReference(series, dataCube) {
        const seriesRefs = immutable_1.Set(series.series.map(series => series.key()));
        const defaultSort = dataCube.getDefaultSortMeasure();
        if (seriesRefs.has(defaultSort))
            return defaultSort;
        return seriesRefs.first();
    }
    static defaultSort(series, dataCube) {
        const reference = Essence.defaultSortReference(series, dataCube);
        return new sort_1.SeriesSort({ reference });
    }
    static timeFilter(filter, dataCube) {
        const timeFilter = filter.getClauseForDimension(dataCube.getTimeDimension());
        if (!filter_clause_1.isTimeFilter(timeFilter))
            throw new Error(`Unknown time filter: ${timeFilter}`);
        return timeFilter;
    }
    toString() {
        return "[Essence]";
    }
    toJS() {
        return {
            visualization: this.visualization,
            visualizationSettings: this.visualizationSettings,
            dataCube: this.dataCube.toJS(),
            timezone: this.timezone.toJS(),
            filter: this.filter && this.filter.toJS(),
            splits: this.splits && this.splits.toJS(),
            series: this.series.toJS(),
            timeShift: this.timeShift.toJS(),
            pinnedSort: this.pinnedSort,
            pinnedDimensions: this.pinnedDimensions.toJS(),
            visResolve: this.visResolve
        };
    }
    // getters
    getTimeAttribute() {
        return this.dataCube.timeAttribute;
    }
    getTimeDimension() {
        return this.dataCube.getTimeDimension();
    }
    evaluateSelection(filter, timekeeper) {
        if (filter instanceof filter_clause_1.FixedTimeFilterClause)
            return filter;
        const { timezone, dataCube } = this;
        return filter.evaluate(timekeeper.now(), dataCube.getMaxTime(timekeeper), timezone);
    }
    combineWithPrevious(filter) {
        const timeDimension = this.getTimeDimension();
        const timeFilter = filter.getClauseForDimension(timeDimension);
        if (!timeFilter || !(timeFilter instanceof filter_clause_1.FixedTimeFilterClause)) {
            throw new Error("Can't combine current time filter with previous period without time filter");
        }
        return filter.setClause(this.combinePeriods(timeFilter));
    }
    getTimeShiftEnv(timekeeper) {
        const timeDimension = this.getTimeDimension();
        if (!this.hasComparison()) {
            return { type: time_shift_env_1.TimeShiftEnvType.CURRENT };
        }
        const currentFilter = filter_clause_1.toExpression(this.currentTimeFilter(timekeeper), timeDimension);
        const previousFilter = filter_clause_1.toExpression(this.previousTimeFilter(timekeeper), timeDimension);
        return {
            type: time_shift_env_1.TimeShiftEnvType.WITH_PREVIOUS,
            shift: this.timeShift.valueOf(),
            currentFilter,
            previousFilter
        };
    }
    constrainTimeShift() {
        const { timeShift, timezone } = this;
        return this.set("timeShift", timeShift.constrainToFilter(this.timeFilter(), timezone));
    }
    getEffectiveFilter(timekeeper, { combineWithPrevious = false, unfilterDimension = null } = {}) {
        const { dataCube, timezone } = this;
        let filter = this.filter;
        if (unfilterDimension)
            filter = filter.removeClause(unfilterDimension.name);
        filter = filter.getSpecificFilter(timekeeper.now(), dataCube.getMaxTime(timekeeper), timezone);
        if (combineWithPrevious) {
            filter = this.combineWithPrevious(filter);
        }
        return filter;
    }
    hasComparison() {
        return !this.timeShift.isEmpty();
    }
    combinePeriods(timeFilter) {
        const { timezone, timeShift } = this;
        const duration = timeShift.valueOf();
        return timeFilter.update("values", values => values.flatMap(({ start, end }) => [
            new date_range_1.DateRange({ start, end }),
            new date_range_1.DateRange({ start: duration.shift(start, timezone, -1), end: duration.shift(end, timezone, -1) })
        ]));
    }
    timeFilter() {
        const { filter, dataCube } = this;
        return Essence.timeFilter(filter, dataCube);
    }
    fixedTimeFilter(timekeeper) {
        const { dataCube, timezone } = this;
        const timeFilter = this.timeFilter();
        if (timeFilter instanceof filter_clause_1.FixedTimeFilterClause)
            return timeFilter;
        return timeFilter.evaluate(timekeeper.now(), dataCube.getMaxTime(timekeeper), timezone);
    }
    currentTimeFilter(timekeeper) {
        return this.fixedTimeFilter(timekeeper);
    }
    shiftToPrevious(timeFilter) {
        const { timezone, timeShift } = this;
        const duration = timeShift.valueOf();
        return timeFilter.update("values", values => values.map(({ start, end }) => new date_range_1.DateRange({
            start: duration.shift(start, timezone, -1),
            end: duration.shift(end, timezone, -1)
        })));
    }
    previousTimeFilter(timekeeper) {
        const timeFilter = this.fixedTimeFilter(timekeeper);
        return this.shiftToPrevious(timeFilter);
    }
    getTimeClause() {
        const timeDimension = this.getTimeDimension();
        return this.filter.getClauseForDimension(timeDimension);
    }
    concreteSeriesFromSeries(series) {
        const { reference } = series;
        const { dataCube } = this;
        const measure = dataCube.getMeasure(reference);
        return create_concrete_series_1.default(series, measure, dataCube.measures);
    }
    findConcreteSeries(key) {
        const series = this.series.series.find(series => series.key() === key);
        if (!series)
            return null;
        return this.concreteSeriesFromSeries(series);
    }
    getConcreteSeries() {
        return this.series.series.map(series => this.concreteSeriesFromSeries(series));
    }
    differentDataCube(other) {
        return this.dataCube !== other.dataCube;
    }
    differentSplits(other) {
        return !this.splits.equals(other.splits);
    }
    differentTimeShift(other) {
        return !this.timeShift.equals(other.timeShift);
    }
    differentSeries(other) {
        return !this.series.equals(other.series);
    }
    differentSettings(other) {
        return !nullable_equals_1.default(this.visualizationSettings, other.visualizationSettings);
    }
    differentEffectiveFilter(other, myTimekeeper, otherTimekeeper, unfilterDimension = null) {
        const myEffectiveFilter = this.getEffectiveFilter(myTimekeeper, { unfilterDimension });
        const otherEffectiveFilter = other.getEffectiveFilter(otherTimekeeper, { unfilterDimension });
        return !myEffectiveFilter.equals(otherEffectiveFilter);
    }
    getCommonSort() {
        return this.splits.getCommonSort();
    }
    // Setters
    changeComparisonShift(timeShift) {
        return this
            .set("timeShift", timeShift)
            .constrainTimeShift()
            .updateSorts();
    }
    updateDataCube(newDataCube) {
        const { dataCube } = this;
        if (dataCube.equals(newDataCube))
            return this;
        function setDataCube(essence) {
            return essence.set("dataCube", newDataCube);
        }
        function constrainProps(essence) {
            const seriesValidInNewCube = essence.series.constrainToMeasures(newDataCube.measures);
            const newSeriesList = !seriesValidInNewCube.isEmpty()
                ? seriesValidInNewCube
                : series_list_1.SeriesList.fromMeasureNames(newDataCube.getDefaultSelectedMeasures().toArray());
            return essence
                .update("filter", filter => filter.constrainToDimensions(newDataCube.dimensions))
                .set("series", newSeriesList)
                .update("splits", splits => splits.constrainToDimensionsAndSeries(newDataCube.dimensions, newSeriesList))
                .update("pinnedDimensions", pinned => constrainDimensions(pinned, newDataCube))
                .update("pinnedSort", sort => !newDataCube.getMeasure(sort) ? newDataCube.getDefaultSortMeasure() : sort);
        }
        function adjustVisualization(essence) {
            const { dataCube, visualization, splits, series } = essence;
            const { visualization: newVis } = Essence.getBestVisualization(dataCube, splits, series, visualization);
            if (newVis === visualization)
                return essence;
            return essence.changeVisualization(newVis, newVis.visualizationSettings.defaults);
        }
        return functional_1.thread(this, setDataCube, constrainProps, adjustVisualization, (essence) => essence.resolveVisualizationAndUpdate());
    }
    changeFilter(filter) {
        const { filter: oldFilter } = this;
        return this
            .set("filter", filter)
            .constrainTimeShift()
            .update("splits", splits => {
            const differentClauses = filter.clauses.filter(clause => {
                const otherClause = oldFilter.clauseForReference(clause.reference);
                return !clause.equals(otherClause);
            });
            return splits.removeBucketingFrom(immutable_1.Set(differentClauses.map(clause => clause.reference)));
        })
            .updateSplitsWithFilter();
    }
    changeTimezone(newTimezone) {
        const { timezone } = this;
        if (timezone === newTimezone)
            return this;
        return this.set("timezone", newTimezone);
    }
    convertToSpecificFilter(timekeeper) {
        const { dataCube, filter, timezone } = this;
        if (!filter.isRelative())
            return this;
        return this.changeFilter(filter.getSpecificFilter(timekeeper.now(), dataCube.getMaxTime(timekeeper), timezone));
    }
    defaultSplitSort(split) {
        const { dataCube, series } = this;
        const dimension = dataCube.getDimension(split.reference);
        const { sortStrategy, name, kind } = dimension;
        if (sortStrategy === "self" || sortStrategy === name) {
            return new sort_1.DimensionSort({ reference: name, direction: sort_1.SortDirection.ascending });
        }
        if (sortStrategy && series.hasMeasureSeries(sortStrategy)) {
            return new sort_1.SeriesSort({ reference: sortStrategy, direction: sort_1.SortDirection.descending });
        }
        if (kind === "time") {
            return new sort_1.DimensionSort({ reference: name, direction: sort_1.SortDirection.ascending });
        }
        return new sort_1.SeriesSort({ reference: this.defaultSort(), direction: sort_1.SortDirection.descending });
    }
    setSortOnSplits(splits) {
        return splits.update("splits", list => list.map(split => {
            return sort_1.isSortEmpty(split.sort) ? split.set("sort", this.defaultSplitSort(split)) : split;
        }));
    }
    changeSplits(splits, strategy) {
        const { splits: oldSplits, dataCube, visualization, visResolve, filter, series } = this;
        const newSplits = this.setSortOnSplits(splits).updateWithFilter(filter, dataCube.dimensions);
        function adjustStrategy(strategy) {
            // If in manual mode stay there, keep the vis regardless of suggested strategy
            if (visResolve.isManual()) {
                return VisStrategy.KeepAlways;
            }
            if (oldSplits.length() > 0 && newSplits.length() !== 0) {
                return VisStrategy.UnfairGame;
            }
            return strategy;
        }
        function adjustVisualization(essence) {
            if (adjustStrategy(strategy) !== VisStrategy.FairGame)
                return essence;
            const { visualization: newVis } = Essence.getBestVisualization(dataCube, newSplits, series, visualization);
            if (newVis === visualization)
                return essence;
            return essence.changeVisualization(newVis, newVis.visualizationSettings.defaults);
        }
        return functional_1.thread(this, (essence) => essence.set("splits", newSplits), adjustVisualization, (essence) => essence.resolveVisualizationAndUpdate());
    }
    changeSplit(splitCombine, strategy) {
        return this.changeSplits(splits_1.Splits.fromSplit(splitCombine), strategy);
    }
    addSplit(split, strategy) {
        return this.changeSplits(this.splits.addSplit(split), strategy);
    }
    removeSplit(split, strategy) {
        return this.changeSplits(this.splits.removeSplit(split), strategy);
    }
    addSeries(series) {
        return this.changeSeriesList(this.series.addSeries(series));
    }
    removeSeries(series) {
        return this.changeSeriesList(this.series.removeSeries(series));
    }
    changeSeriesList(series) {
        return this
            .set("series", series)
            .updateSorts()
            .resolveVisualizationAndUpdate();
    }
    defaultSort() {
        return Essence.defaultSortReference(this.series, this.dataCube);
    }
    updateSorts() {
        const seriesRefs = immutable_1.Set(this.series.series.map(series => series.reference));
        return this
            .update("pinnedSort", sort => {
            if (seriesRefs.has(sort))
                return sort;
            return this.defaultSort();
        })
            .update("splits", splits => splits.update("splits", splits => splits.map((split) => {
            const { sort } = split;
            const { type, reference } = sort;
            switch (type) {
                case sort_1.SortType.DIMENSION:
                    return split;
                case sort_1.SortType.SERIES: {
                    const measureSort = sort;
                    if (!seriesRefs.has(reference)) {
                        const measureSortRef = this.defaultSort();
                        if (measureSortRef) {
                            return split.changeSort(new sort_1.SeriesSort({
                                reference: measureSortRef
                            }));
                        }
                        return split.changeSort(new sort_1.DimensionSort({
                            reference: split.reference
                        }));
                    }
                    if (measureSort.period !== concrete_series_1.SeriesDerivation.CURRENT && !this.hasComparison()) {
                        return split.update("sort", (sort) => sort.set("period", concrete_series_1.SeriesDerivation.CURRENT));
                    }
                    return split;
                }
            }
        })));
    }
    updateSplitsWithFilter() {
        const { filter, dataCube: { dimensions }, splits } = this;
        const newSplits = splits.updateWithFilter(filter, dimensions);
        if (splits === newSplits)
            return this;
        return this.set("splits", newSplits).resolveVisualizationAndUpdate();
    }
    changeVisualization(visualization, settings = visualization.visualizationSettings.defaults) {
        return this
            .set("visualization", visualization)
            .set("visualizationSettings", settings)
            .resolveVisualizationAndUpdate();
    }
    resolveVisualizationAndUpdate() {
        const { visualization, splits, dataCube, series } = this;
        const result = resolveVisualization({ splits, dataCube, visualization, series });
        return this
            .set("visResolve", result.visResolve)
            .set("visualization", result.visualization)
            .set("splits", result.splits);
    }
    pin({ name }) {
        return this.update("pinnedDimensions", pinned => pinned.add(name));
    }
    unpin({ name }) {
        return this.update("pinnedDimensions", pinned => pinned.remove(name));
    }
    changePinnedSortSeries(series) {
        return this.set("pinnedSort", series.plywoodKey());
    }
    seriesSortOns(withTimeShift) {
        const series = this.getConcreteSeries();
        const addPrevious = withTimeShift && this.hasComparison();
        if (!addPrevious)
            return series.map(series => new sort_on_1.SeriesSortOn(series));
        return series.flatMap(series => {
            return [
                new sort_on_1.SeriesSortOn(series),
                new sort_on_1.SeriesSortOn(series, concrete_series_1.SeriesDerivation.PREVIOUS),
                new sort_on_1.SeriesSortOn(series, concrete_series_1.SeriesDerivation.DELTA)
            ];
        });
    }
    getPinnedSortSeries() {
        return this.findConcreteSeries(this.pinnedSort);
    }
}
exports.Essence = Essence;
//# sourceMappingURL=essence.js.map