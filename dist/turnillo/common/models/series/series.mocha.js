"use strict";
/*
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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const expression_1 = require("../expression/expression");
const percent_1 = require("../expression/percent");
const measure_1 = require("../measure/measure");
const measure_fixtures_1 = require("../measure/measure.fixtures");
const expression_series_1 = require("./expression-series");
const measure_series_1 = require("./measure-series");
const quantile_series_1 = require("./quantile-series");
const series_1 = require("./series");
const series_format_1 = require("./series-format");
const series_type_1 = require("./series-type");
const quantileMeasure = measure_1.Measure.fromJS({
    name: "quantile",
    formula: "$main.quantile($histogram,0.95,'tuning')"
});
const quantileOperandMeasure = measure_1.Measure.fromJS({
    name: "quantile_by_100",
    formula: "$main.quantile($histogram,0.95,'tuning').divide(100)"
});
describe("Series", () => {
    describe("fromJS", () => {
        it("should construct Expression Series", () => {
            const params = {
                type: series_type_1.SeriesType.EXPRESSION,
                expression: { operation: expression_1.ExpressionSeriesOperation.PERCENT_OF_PARENT },
                reference: "count"
            };
            const measure = measure_fixtures_1.MeasureFixtures.wikiCount();
            const expected = new expression_series_1.ExpressionSeries({
                expression: new percent_1.PercentExpression({ operation: expression_1.ExpressionSeriesOperation.PERCENT_OF_PARENT }),
                format: series_format_1.DEFAULT_FORMAT,
                type: series_type_1.SeriesType.EXPRESSION,
                reference: "count"
            });
            chai_1.expect(series_1.fromJS(params, measure)).to.be.equivalent(expected);
        });
        it("should construct Quantile Series", () => {
            const params = {
                type: series_type_1.SeriesType.QUANTILE,
                reference: "quantile"
            };
            const measure = quantileMeasure;
            const expected = new quantile_series_1.QuantileSeries({
                format: series_format_1.DEFAULT_FORMAT,
                percentile: 95,
                type: series_type_1.SeriesType.QUANTILE,
                reference: "quantile"
            });
            chai_1.expect(series_1.fromJS(params, measure)).to.be.equivalent(expected);
        });
        it("should construct Measure Series", () => {
            const params = {
                type: series_type_1.SeriesType.MEASURE,
                reference: "count"
            };
            const measure = measure_fixtures_1.MeasureFixtures.wikiCount();
            const expected = new measure_series_1.MeasureSeries({
                format: series_format_1.DEFAULT_FORMAT,
                type: series_type_1.SeriesType.MEASURE,
                reference: "count"
            });
            chai_1.expect(series_1.fromJS(params, measure)).to.be.equivalent(expected);
        });
        it("should construct Quantile Series for Measure definition when passed Measure with quantile expression", () => {
            const params = {
                type: series_type_1.SeriesType.MEASURE,
                reference: "quantile"
            };
            const measure = quantileMeasure;
            const expected = new quantile_series_1.QuantileSeries({
                format: series_format_1.DEFAULT_FORMAT,
                type: series_type_1.SeriesType.QUANTILE,
                percentile: 95,
                reference: "quantile"
            });
            chai_1.expect(series_1.fromJS(params, measure)).to.be.equivalent(expected);
        });
        it("should construct Measure Series when no type provided", () => {
            const params = {
                reference: "count"
            };
            const measure = measure_fixtures_1.MeasureFixtures.wikiCount();
            const expected = new measure_series_1.MeasureSeries({
                format: series_format_1.DEFAULT_FORMAT,
                type: series_type_1.SeriesType.MEASURE,
                reference: "count"
            });
            chai_1.expect(series_1.fromJS(params, measure)).to.be.equivalent(expected);
        });
        it("should construct Quantile Series when no type provided but Measure has quantile expression", () => {
            const params = {
                reference: "quantile"
            };
            const measure = quantileMeasure;
            const expected = new quantile_series_1.QuantileSeries({
                format: series_format_1.DEFAULT_FORMAT,
                type: series_type_1.SeriesType.QUANTILE,
                percentile: 95,
                reference: "quantile"
            });
            chai_1.expect(series_1.fromJS(params, measure)).to.be.equivalent(expected);
        });
    });
    describe("fromMeasure", () => {
        it("should create Measure Series for non-quantile expression", () => {
            chai_1.expect(series_1.fromMeasure(measure_fixtures_1.MeasureFixtures.wikiCount())).to.be.instanceOf(measure_series_1.MeasureSeries);
        });
        it("should create Quantile Series for quantile expression", () => {
            chai_1.expect(series_1.fromMeasure(quantileMeasure)).to.be.instanceOf(quantile_series_1.QuantileSeries);
        });
        it("should create Measure Series for expression with quantile operand", () => {
            chai_1.expect(series_1.fromMeasure(quantileOperandMeasure)).to.be.instanceOf(measure_series_1.MeasureSeries);
        });
    });
});
//# sourceMappingURL=series.mocha.js.map