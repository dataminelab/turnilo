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
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const dimension_fixtures_1 = require("./dimension.fixtures");
const dimensions_1 = require("./dimensions");
const dimensions_fixtures_1 = require("./dimensions.fixtures");
describe("Dimensions", () => {
    let dimensions;
    beforeEach(() => {
        dimensions = dimensions_1.Dimensions.fromJS(dimensions_fixtures_1.DimensionsFixtures.wikiJS());
    });
    it("should convert symmetrically to / from JS", () => {
        chai_1.expect(dimensions.toJS()).to.deep.equal(dimensions_fixtures_1.DimensionsFixtures.wikiJS());
    });
    it("should throw when converting tree with duplicate dimension names", () => {
        const dimensionsWithDuplicateDimensionName = [dimension_fixtures_1.DimensionFixtures.wikiTimeJS(), dimension_fixtures_1.DimensionFixtures.wikiTimeJS()];
        chai_1.expect(() => dimensions_1.Dimensions.fromJS(dimensionsWithDuplicateDimensionName)).to.throw("found duplicate dimension or group with names: 'time'");
    });
    it("should throw when converting tree with duplicate dimension or group names", () => {
        const fakeDimensionWithDuplicateName = { name: "comment_group", formula: "$comment_group" };
        const dimensionsWithDuplicateDimensionName = [fakeDimensionWithDuplicateName, ...dimensions_fixtures_1.DimensionsFixtures.wikiJS()];
        chai_1.expect(() => dimensions_1.Dimensions.fromJS(dimensionsWithDuplicateDimensionName)).to.throw("found duplicate dimension or group with names: 'comment_group'");
    });
    it("should count dimensions", () => {
        chai_1.expect(dimensions.size()).to.equal(12);
    });
    it("should return the first dimension", () => {
        chai_1.expect(dimensions.first().toJS()).to.deep.equal(dimension_fixtures_1.DimensionFixtures.wikiTimeJS());
    });
    it("should treat dimensions with the same structure as equal", () => {
        const otherDimensions = dimensions_1.Dimensions.fromJS(dimensions_fixtures_1.DimensionsFixtures.wikiJS());
        chai_1.expect(dimensions).to.be.equivalent(otherDimensions);
    });
    it("should treat dimensions with different structure as different", () => {
        const [, ...dimensionsWithoutFirstJS] = dimensions_fixtures_1.DimensionsFixtures.wikiJS();
        const dimensionsWithoutCount = dimensions_1.Dimensions.fromJS(dimensionsWithoutFirstJS);
        chai_1.expect(dimensions).to.not.be.equivalent(dimensionsWithoutCount);
    });
    it("should map dimensions", () => {
        const dimensionNames = dimensions.mapDimensions(dimension => dimension.name);
        chai_1.expect(dimensionNames).to.deep.equal(dimensions_fixtures_1.DimensionsFixtures.wikiNames());
    });
    it("should filter dimensions", () => {
        const countDimensionsJS = dimensions
            .filterDimensions(dimension => dimension.name === "time")
            .map(dimension => dimension.toJS());
        chai_1.expect(countDimensionsJS).to.deep.equal([dimension_fixtures_1.DimensionFixtures.wikiTimeJS()]);
    });
    it("should traverse dimensions", () => {
        let dimensionTitles = [];
        dimensions.forEachDimension(dimension => dimensionTitles.push(dimension.title));
        chai_1.expect(dimensionTitles).to.deep.equal(dimensions_fixtures_1.DimensionsFixtures.wikiTitles());
    });
    it("should find dimension by name", () => {
        const dimension = dimensions.getDimensionByName("time");
        chai_1.expect(dimension.toJS()).to.deep.equal(dimension_fixtures_1.DimensionFixtures.wikiTimeJS());
    });
    it("should find dimension by expression", () => {
        const dimension = dimensions.getDimensionByExpression(plywood_1.Expression.fromJSLoose("$time"));
        chai_1.expect(dimension.toJS()).to.deep.equal(dimension_fixtures_1.DimensionFixtures.wikiTimeJS());
    });
    it("should know it contains dimension with name", () => {
        chai_1.expect(dimensions.containsDimensionWithName("time")).to.be.true;
    });
    it("should provide dimension names", () => {
        const dimensionNames = dimensions.getDimensionNames();
        chai_1.expect(dimensionNames).to.deep.equal(immutable_1.List(dimensions_fixtures_1.DimensionsFixtures.wikiNames()));
    });
    it("should be immutable on append", () => {
        const newDimensions = dimensions.append(dimension_fixtures_1.DimensionFixtures.number());
        chai_1.expect(dimensions.size()).to.equal(12);
        chai_1.expect(newDimensions).to.not.equal(dimensions);
        chai_1.expect(newDimensions).to.not.be.equivalent(dimensions);
        chai_1.expect(newDimensions.size()).to.equal(13);
    });
    it("should be immutable on prepend", () => {
        const newDimensions = dimensions.prepend(dimension_fixtures_1.DimensionFixtures.number());
        chai_1.expect(dimensions.size()).to.equal(12);
        chai_1.expect(newDimensions).to.not.equal(dimensions);
        chai_1.expect(newDimensions).to.not.be.equivalent(dimensions);
        chai_1.expect(newDimensions.size()).to.equal(13);
    });
});
//# sourceMappingURL=dimensions.mocha.js.map