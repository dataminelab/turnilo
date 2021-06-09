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
const measure_group_1 = require("./measure-group");
const measure_group_fixtures_1 = require("./measure-group.fixtures");
describe("MeasureGroup", () => {
    it("should convert to / from JS", () => {
        const measureGroup = measure_group_1.MeasureGroup.fromJS(measure_group_fixtures_1.MeasureGroupFixtures.wikiAddedJS());
        chai_1.expect(measureGroup.toJS()).to.deep.equal(measure_group_fixtures_1.MeasureGroupFixtures.wikiAddedJS());
    });
    it("should infer title from name", () => {
        const measureGroup = measure_group_1.MeasureGroup.fromJS(measure_group_fixtures_1.MeasureGroupFixtures.noTitleJS());
        chai_1.expect(measureGroup.toJS()).to.deep.equal(measure_group_fixtures_1.MeasureGroupFixtures.withTitleInferredJS());
    });
    it("should infer title from name", () => {
        const measureGroup = measure_group_1.MeasureGroup.fromJS(measure_group_fixtures_1.MeasureGroupFixtures.noTitleJS());
        chai_1.expect(measureGroup.toJS()).to.deep.equal(measure_group_fixtures_1.MeasureGroupFixtures.withTitleInferredJS());
    });
    it("should throw when no name given", () => {
        const measureGroupConversion = () => measure_group_1.MeasureGroup.fromJS(measure_group_fixtures_1.MeasureGroupFixtures.noNameJS());
        chai_1.expect(measureGroupConversion).to.throw("measure group requires a name");
    });
    it("should throw when no measures given", () => {
        const groupWithNoMeasures = measure_group_fixtures_1.MeasureGroupFixtures.noMeasuresJS();
        const measureGroupConversion = () => measure_group_1.MeasureGroup.fromJS(groupWithNoMeasures);
        chai_1.expect(measureGroupConversion).to.throw(`measure group '${groupWithNoMeasures.name}' has no measures`);
    });
    it("should throw when empty measures given", () => {
        const groupWithEmptyMeasures = measure_group_fixtures_1.MeasureGroupFixtures.emptyMeasuresJS();
        const measureGroupConversion = () => measure_group_1.MeasureGroup.fromJS(groupWithEmptyMeasures);
        chai_1.expect(measureGroupConversion).to.throw(`measure group '${groupWithEmptyMeasures.name}' has no measures`);
    });
});
//# sourceMappingURL=measure-group.mocha.js.map