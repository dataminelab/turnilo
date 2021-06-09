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
const measure_fixtures_1 = require("./measure.fixtures");
const measures_1 = require("./measures");
const measures_fixtures_1 = require("./measures.fixtures");
describe("Measures", () => {
    let measures;
    beforeEach(() => {
        measures = measures_1.Measures.fromJS(measures_fixtures_1.MeasuresFixtures.wikiJS());
    });
    it("should convert symmetrically to / from JS", () => {
        chai_1.expect(measures.toJS()).to.deep.equal(measures_fixtures_1.MeasuresFixtures.wikiJS());
    });
    it("should throw when converting tree with duplicate measure names", () => {
        const measuresWithDuplicateMeasureName = [measure_fixtures_1.MeasureFixtures.wikiCountJS(), measure_fixtures_1.MeasureFixtures.wikiCountJS()];
        chai_1.expect(() => measures_1.Measures.fromJS(measuresWithDuplicateMeasureName)).to.throw("found duplicate measure or group with names: 'count'");
    });
    it("should throw when converting tree with duplicate measure or group names", () => {
        const fakeMeasureWithDuplicateName = { name: "added_group", formula: "$main.sum($count)" };
        const measuresWithDuplicateMeasureName = [fakeMeasureWithDuplicateName, ...measures_fixtures_1.MeasuresFixtures.wikiJS()];
        chai_1.expect(() => measures_1.Measures.fromJS(measuresWithDuplicateMeasureName)).to.throw("found duplicate measure or group with names: 'added_group'");
    });
    it("should throw when converting tree with previous measure name", () => {
        const measureWithForbiddenNames = [measure_fixtures_1.MeasureFixtures.previousWikiCountJS()];
        chai_1.expect(() => measures_1.Measures.fromJS(measureWithForbiddenNames)).to.throw("found measure that starts with forbidden prefixes: '_previous__count' (prefix: '_previous__')");
    });
    it("should throw when converting tree with delta measure name", () => {
        const measureWithForbiddenNames = [measure_fixtures_1.MeasureFixtures.deltaWikiCountJS()];
        chai_1.expect(() => measures_1.Measures.fromJS(measureWithForbiddenNames)).to.throw("found measure that starts with forbidden prefixes: '_delta__count' (prefix: '_delta__')");
    });
    it("should count measures", () => {
        chai_1.expect(measures.size()).to.equal(5);
    });
    it("should return the first measure", () => {
        chai_1.expect(measures.first().toJS()).to.deep.equal(measure_fixtures_1.MeasureFixtures.wikiCountJS());
    });
    it("should treat measures with the same structure as equal", () => {
        const otherMeasures = measures_1.Measures.fromJS(measures_fixtures_1.MeasuresFixtures.wikiJS());
        chai_1.expect(measures).to.be.equivalent(otherMeasures);
    });
    it("should treat measures with different structure as different", () => {
        const [, ...measuresWithoutFirstJS] = measures_fixtures_1.MeasuresFixtures.wikiJS();
        const measuresWithoutCount = measures_1.Measures.fromJS(measuresWithoutFirstJS);
        chai_1.expect(measures).to.not.be.equivalent(measuresWithoutCount);
    });
    it("should map measures", () => {
        const measureNames = measures.mapMeasures(measure => measure.name);
        chai_1.expect(measureNames).to.deep.equal(measures_fixtures_1.MeasuresFixtures.wikiNames());
    });
    it("should filter measures", () => {
        const countMeasuresJS = measures
            .filterMeasures(measure => measure.name === "count")
            .map(measure => measure.toJS());
        chai_1.expect(countMeasuresJS).to.deep.equal([measure_fixtures_1.MeasureFixtures.wikiCountJS()]);
    });
    it("should traverse measures", () => {
        let measureTitles = [];
        measures.forEachMeasure(measure => measureTitles.push(measure.title));
        chai_1.expect(measureTitles).to.deep.equal(measures_fixtures_1.MeasuresFixtures.wikiTitles());
    });
    it("should find measure by name", () => {
        const measure = measures.getMeasureByName("count");
        chai_1.expect(measure.toJS()).to.deep.equal(measure_fixtures_1.MeasureFixtures.wikiCountJS());
    });
    it("should find measure by expression", () => {
        const measure = measures.getMeasureByExpression(plywood_1.Expression.fromJSLoose("$main.sum($count)"));
        chai_1.expect(measure.toJS()).to.deep.equal(measure_fixtures_1.MeasureFixtures.wikiCountJS());
    });
    it("should know it contains measure with name", () => {
        chai_1.expect(measures.containsMeasureWithName("count")).to.be.true;
    });
    it("should provide measure names", () => {
        const measureNames = measures.getMeasureNames();
        chai_1.expect(measureNames).to.deep.equal(immutable_1.List(measures_fixtures_1.MeasuresFixtures.wikiNames()));
    });
    it("should provide first n measure names", () => {
        const measureNames = measures.getFirstNMeasureNames(1);
        chai_1.expect(measureNames).to.deep.equal(immutable_1.OrderedSet(["count"]));
    });
    it("should be immutable on append", () => {
        const newMeasures = measures.append(measure_fixtures_1.MeasureFixtures.wikiUniqueUsers());
        chai_1.expect(measures.size()).to.equal(5);
        chai_1.expect(newMeasures).to.not.equal(measures);
        chai_1.expect(newMeasures).to.not.be.equivalent(measures);
        chai_1.expect(newMeasures.size()).to.equal(6);
    });
    it("should be immutable on prepend", () => {
        const newMeasures = measures.prepend(measure_fixtures_1.MeasureFixtures.wikiUniqueUsers());
        chai_1.expect(measures.size()).to.equal(5);
        chai_1.expect(newMeasures).to.not.equal(measures);
        chai_1.expect(newMeasures).to.not.be.equivalent(measures);
        chai_1.expect(newMeasures.size()).to.equal(6);
    });
});
//# sourceMappingURL=measures.mocha.js.map