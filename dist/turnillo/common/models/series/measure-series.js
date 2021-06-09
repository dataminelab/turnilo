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
exports.MeasureSeries = void 0;
const immutable_1 = require("immutable");
const concrete_series_1 = require("./concrete-series");
const series_format_1 = require("./series-format");
const series_type_1 = require("./series-type");
const defaultMeasureSeries = {
    reference: null,
    format: series_format_1.DEFAULT_FORMAT,
    type: series_type_1.SeriesType.MEASURE
};
class MeasureSeries extends immutable_1.Record(defaultMeasureSeries) {
    static fromMeasure(measure) {
        return new MeasureSeries({ reference: measure.name });
    }
    static fromJS({ reference, format, type }) {
        return new MeasureSeries({ reference, type, format: series_format_1.SeriesFormat.fromJS(format) });
    }
    constructor(params) {
        super(params);
    }
    key() {
        return this.reference;
    }
    plywoodKey(derivation = concrete_series_1.SeriesDerivation.CURRENT) {
        return concrete_series_1.getNameWithDerivation(this.reference, derivation);
    }
}
exports.MeasureSeries = MeasureSeries;
//# sourceMappingURL=measure-series.js.map