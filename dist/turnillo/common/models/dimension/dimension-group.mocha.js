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
const dimension_group_1 = require("./dimension-group");
const dimension_group_fixtures_1 = require("./dimension-group.fixtures");
describe("DimensionGroup", () => {
    it("should convert to / from JS", () => {
        const dimensionGroup = dimension_group_1.DimensionGroup.fromJS(dimension_group_fixtures_1.DimensionGroupFixtures.commentsJS());
        chai_1.expect(dimensionGroup.toJS()).to.deep.equal(dimension_group_fixtures_1.DimensionGroupFixtures.commentsJS());
    });
    it("should infer title from name", () => {
        const dimensionGroup = dimension_group_1.DimensionGroup.fromJS(dimension_group_fixtures_1.DimensionGroupFixtures.noTitleJS());
        chai_1.expect(dimensionGroup.toJS()).to.deep.equal(dimension_group_fixtures_1.DimensionGroupFixtures.withTitleInferredJS());
    });
    it("should infer title from name", () => {
        const dimensionGroup = dimension_group_1.DimensionGroup.fromJS(dimension_group_fixtures_1.DimensionGroupFixtures.noTitleJS());
        chai_1.expect(dimensionGroup.toJS()).to.deep.equal(dimension_group_fixtures_1.DimensionGroupFixtures.withTitleInferredJS());
    });
    it("should throw when no name given", () => {
        const dimensionGroupConversion = () => dimension_group_1.DimensionGroup.fromJS(dimension_group_fixtures_1.DimensionGroupFixtures.noNameJS());
        chai_1.expect(dimensionGroupConversion).to.throw("dimension group requires a name");
    });
    it("should throw when no dimensions given", () => {
        const groupWithNoDimensions = dimension_group_fixtures_1.DimensionGroupFixtures.noDimensionsJS();
        const dimensionGroupConversion = () => dimension_group_1.DimensionGroup.fromJS(groupWithNoDimensions);
        chai_1.expect(dimensionGroupConversion).to.throw(`dimension group '${groupWithNoDimensions.name}' has no dimensions`);
    });
    it("should throw when empty dimensions given", () => {
        const groupWithEmptyDimensions = dimension_group_fixtures_1.DimensionGroupFixtures.emptyDimensionsJS();
        const dimensionGroupConversion = () => dimension_group_1.DimensionGroup.fromJS(groupWithEmptyDimensions);
        chai_1.expect(dimensionGroupConversion).to.throw(`dimension group '${groupWithEmptyDimensions.name}' has no dimensions`);
    });
});
//# sourceMappingURL=dimension-group.mocha.js.map