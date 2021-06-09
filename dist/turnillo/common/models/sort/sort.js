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
exports.isSortEmpty = exports.DimensionSort = exports.SeriesSort = exports.sortDirectionMapper = exports.SortDirection = exports.SortType = void 0;
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const concrete_series_1 = require("../series/concrete-series");
const measure_series_1 = require("../series/measure-series");
var SortType;
(function (SortType) {
    SortType["SERIES"] = "series";
    SortType["DIMENSION"] = "dimension";
})(SortType = exports.SortType || (exports.SortType = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["ascending"] = "ascending";
    SortDirection["descending"] = "descending";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
exports.sortDirectionMapper = {
    ascending: "ascending",
    descending: "descending"
};
const defaultSeriesSort = {
    reference: null,
    type: SortType.SERIES,
    direction: SortDirection.descending,
    period: concrete_series_1.SeriesDerivation.CURRENT
};
class SeriesSort extends immutable_1.Record(defaultSeriesSort) {
    constructor(params) {
        super(params);
    }
    toExpression() {
        const series = new measure_series_1.MeasureSeries({ reference: this.reference });
        return new plywood_1.SortExpression({
            direction: exports.sortDirectionMapper[this.direction],
            expression: plywood_1.$(series.plywoodKey(this.period))
        });
    }
}
exports.SeriesSort = SeriesSort;
const defaultDimensionSort = {
    reference: null,
    type: SortType.DIMENSION,
    direction: SortDirection.descending
};
class DimensionSort extends immutable_1.Record(defaultDimensionSort) {
    constructor(params) {
        super(params);
    }
    toExpression() {
        return new plywood_1.SortExpression(({
            direction: exports.sortDirectionMapper[this.direction],
            expression: plywood_1.$(this.reference)
        }));
    }
}
exports.DimensionSort = DimensionSort;
function isSortEmpty(sort) {
    return sort.reference === null;
}
exports.isSortEmpty = isSortEmpty;
//# sourceMappingURL=sort.js.map