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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chronoshift_1 = require("chronoshift");
const plywood_1 = require("plywood");
const granularity_1 = require("./granularity");
describe("Granularity", () => {
    it("fromJSes appropriately", () => {
        const timeBucketAction1 = granularity_1.granularityFromJS("P1W");
        chai_1.expect(timeBucketAction1 instanceof chronoshift_1.Duration).to.be.true;
        chai_1.expect(timeBucketAction1).to.deep.equal(chronoshift_1.Duration.fromJS("P1W"));
        const timeBucketAction2 = granularity_1.granularityFromJS("PT1H");
        chai_1.expect(timeBucketAction2 instanceof chronoshift_1.Duration).to.be.true;
        chai_1.expect(timeBucketAction2).to.deep.equal(chronoshift_1.Duration.fromJS("PT1H"));
        const numberBucketAction1 = granularity_1.granularityFromJS(5);
        chai_1.expect(typeof numberBucketAction1 === "number").to.be.true;
        chai_1.expect(numberBucketAction1).to.equal(5);
    });
    it("to strings appropriately", () => {
        const timeBucketAction1 = granularity_1.granularityFromJS("P1W");
        chai_1.expect(granularity_1.granularityToString(timeBucketAction1)).to.equal("P1W");
        const numberBucketAction1 = granularity_1.granularityFromJS(5);
        const numberBucketAction3 = granularity_1.granularityFromJS(300000);
        const numberBucketAction4 = granularity_1.granularityFromJS(2);
        chai_1.expect(granularity_1.granularityToString(numberBucketAction1)).to.equal("5");
        chai_1.expect(granularity_1.granularityToString(numberBucketAction3)).to.equal("300000");
        chai_1.expect(granularity_1.granularityToString(numberBucketAction4)).to.equal("2");
    });
    it("equals appropriately", () => {
        const timeBucketAction1 = granularity_1.granularityFromJS("P1W");
        const timeBucketAction2 = granularity_1.granularityFromJS("P1W");
        const timeBucketAction3 = granularity_1.granularityFromJS("P1D");
        chai_1.expect(granularity_1.granularityEquals(timeBucketAction1, timeBucketAction2)).to.be.true;
        chai_1.expect(granularity_1.granularityEquals(timeBucketAction2, timeBucketAction3)).to.be.false;
        const numberBucketAction1 = granularity_1.granularityFromJS(5);
        const numberBucketAction2 = granularity_1.granularityFromJS(5);
        const numberBucketAction3 = granularity_1.granularityFromJS(3);
        chai_1.expect(granularity_1.granularityEquals(numberBucketAction1, numberBucketAction2)).to.be.true;
        chai_1.expect(granularity_1.granularityEquals(numberBucketAction2, numberBucketAction3)).to.be.false;
    });
    it("getGranularities appropriately for time", () => {
        const defaults = granularity_1.getGranularities("time");
        let expectedDefaults = ["PT1M", "PT5M", "PT1H", "P1D", "P1W"].map(granularity_1.granularityFromJS);
        chai_1.expect(defaults.every((g, i) => granularity_1.granularityEquals(g, expectedDefaults[i]), "time defaults are returned")).to.be.true;
        const coarse = granularity_1.getGranularities("time", null, true);
        const expectedCoarseDefaults = ["PT1M", "PT5M", "PT1H", "PT6H", "PT12H", "P1D", "P1W", "P1M"].map(granularity_1.granularityFromJS);
        chai_1.expect(coarse.every((g, i) => granularity_1.granularityEquals(g, expectedCoarseDefaults[i]), "coarse time defaults are returned")).to.be.true;
        const bucketedBy = granularity_1.getGranularities("time", granularity_1.granularityFromJS("PT12H"), false);
        expectedDefaults = ["PT12H", "P1D", "P1W", "P1M", "P3M"].map(granularity_1.granularityFromJS);
        chai_1.expect(bucketedBy.every((g, i) => granularity_1.granularityEquals(g, expectedDefaults[i]), "bucketed by time defaults are returned")).to.be.true;
    });
    it("getGranularities appropriately for number", () => {
        const defaults = granularity_1.getGranularities("number");
        const expectedDefaults = [0.1, 1, 10, 100, 1000].map(granularity_1.granularityFromJS);
        chai_1.expect(defaults.every((g, i) => granularity_1.granularityEquals(g, expectedDefaults[i]), "number defaults are returned")).to.be.true;
        const bucketedBy = granularity_1.getGranularities("number", granularity_1.granularityFromJS(100), false);
        const expectedGrans = [100, 500, 1000, 5000, 10000].map(granularity_1.granularityFromJS);
        chai_1.expect(bucketedBy.every((g, i) => granularity_1.granularityEquals(g, expectedGrans[i]), "bucketed by returns larger granularities")).to.be.true;
    });
    it("getDefaultGranularityForKind appropriately for number", () => {
        const defaultNumber = granularity_1.getDefaultGranularityForKind("number");
        let expected = granularity_1.granularityFromJS(10);
        chai_1.expect(granularity_1.granularityEquals(defaultNumber, expected)).to.equal(true);
        const bucketedBy = granularity_1.getDefaultGranularityForKind("number", granularity_1.granularityFromJS(50));
        expected = granularity_1.granularityFromJS(50);
        chai_1.expect(granularity_1.granularityEquals(bucketedBy, expected), "default will bucket by provided bucketedBy amount").to.equal(true);
        const customGrans = granularity_1.getDefaultGranularityForKind("number", null, [100, 500, 1000, 5000, 10000].map(granularity_1.granularityFromJS));
        expected = granularity_1.granularityFromJS(1000);
        chai_1.expect(granularity_1.granularityEquals(customGrans, expected), "default will bucket according to provided customs").to.equal(true);
    });
    it("getDefaultGranularityForKind appropriately for time", () => {
        const defaultNumber = granularity_1.getDefaultGranularityForKind("time");
        let expected = granularity_1.granularityFromJS("P1D");
        chai_1.expect(granularity_1.granularityEquals(defaultNumber, expected)).to.equal(true);
        const bucketedBy = granularity_1.getDefaultGranularityForKind("time", granularity_1.granularityFromJS("P1W"));
        expected = granularity_1.granularityFromJS("P1W");
        chai_1.expect(granularity_1.granularityEquals(bucketedBy, expected), "default will bucket by provided bucketedBy amount").to.equal(true);
        const customGrans = granularity_1.getDefaultGranularityForKind("time", null, ["PT1H", "PT8H", "PT12H", "P1D", "P1W"].map(granularity_1.granularityFromJS));
        expected = granularity_1.granularityFromJS("PT12H");
        chai_1.expect(granularity_1.granularityEquals(customGrans, expected), "default will bucket according to provided customs").to.equal(true);
    });
    it("getsBestBucketUnit appropriately for time defaults depending on coarse flag", () => {
        const month = "P1M";
        const week = "P1W";
        const day = "P1D";
        const twelveHours = "PT12H";
        const sixHours = "PT6H";
        const oneHour = "PT1H";
        const fiveMinutes = "PT5M";
        const oneMinute = "PT1M";
        const yearLength = new plywood_1.TimeRange({ start: new Date("1994-02-24T00:00:00.000Z"), end: new Date("1995-02-25T00:00:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(yearLength, false).toString()).to.equal(week);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(yearLength, true).toString()).to.equal(month);
        const monthLength = new plywood_1.TimeRange({ start: new Date("1995-02-24T00:00:00.000Z"), end: new Date("1995-03-25T00:00:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(monthLength, false).toString()).to.equal(day);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(monthLength, true).toString()).to.equal(week);
        const sevenDaysLength = new plywood_1.TimeRange({ start: new Date("1995-02-20T00:00:00.000Z"), end: new Date("1995-02-28T00:00:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(sevenDaysLength, false).toString()).to.equal(oneHour);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(sevenDaysLength, true).toString()).to.equal(day);
        const threeDaysLength = new plywood_1.TimeRange({ start: new Date("1995-02-20T00:00:00.000Z"), end: new Date("1995-02-24T00:00:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(sevenDaysLength, false).toString()).to.equal(oneHour);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(threeDaysLength, true).toString()).to.equal(twelveHours);
        const dayLength = new plywood_1.TimeRange({ start: new Date("1995-02-24T00:00:00.000Z"), end: new Date("1995-02-25T00:00:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(dayLength, false).toString()).to.equal(oneHour);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(dayLength, true).toString()).to.equal(sixHours);
        const fourHours = new plywood_1.TimeRange({ start: new Date("1995-02-24T00:00:00.000Z"), end: new Date("1995-02-24T04:00:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(fourHours, false).toString()).to.equal(fiveMinutes);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(fourHours, true).toString()).to.equal(oneHour);
        const fortyFiveMin = new plywood_1.TimeRange({ start: new Date("1995-02-24T00:00:00.000Z"), end: new Date("1995-02-24T00:45:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(fortyFiveMin, false).toString()).to.equal(oneMinute);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(fortyFiveMin, true).toString()).to.equal(fiveMinutes);
    });
    it("getsBestBucketUnit appropriately for time with bucketing and custom granularities", () => {
        const sixHours = "PT6H";
        const oneHour = "PT1H";
        const week = "P1W";
        const dayLength = new plywood_1.TimeRange({ start: new Date("1995-02-24T00:00:00.000Z"), end: new Date("1995-02-25T00:00:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(dayLength, false).toString()).to.equal(oneHour);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(dayLength, false, granularity_1.granularityFromJS("PT6H")).toString()).to.equal(sixHours);
        const yearLength = new plywood_1.TimeRange({ start: new Date("1994-02-24T00:00:00.000Z"), end: new Date("1995-02-25T00:00:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(yearLength, false, granularity_1.granularityFromJS("PT6H")).toString()).to.equal(week);
        const customs = ["PT1H", "PT8H", "PT12H", "P1D", "P1W"].map(granularity_1.granularityFromJS);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(dayLength, false, null, customs).toString()).to.equal(oneHour);
        const fortyFiveMin = new plywood_1.TimeRange({ start: new Date("1995-02-24T00:00:00.000Z"), end: new Date("1995-02-24T00:45:00.000Z") });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(fortyFiveMin, false, null, customs).toString()).to.equal(oneHour);
    });
    it("getsBestBucketUnit appropriately for number defaults with bucketing and custom granularities", () => {
        const ten = new plywood_1.NumberRange({ start: 0, end: 10 });
        const thirtyOne = new plywood_1.NumberRange({ start: 0, end: 31 });
        const hundred = new plywood_1.NumberRange({ start: 0, end: 100 });
        chai_1.expect(granularity_1.getBestBucketUnitForRange(ten, false)).to.equal(1);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(thirtyOne, false)).to.equal(1);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(hundred, false)).to.equal(1);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(hundred, false, granularity_1.granularityFromJS(50))).to.equal(50);
        const customs = [-5, 0.25, 0.5, 0.78, 5].map(granularity_1.granularityFromJS);
        chai_1.expect(granularity_1.getBestBucketUnitForRange(ten, false, null, customs)).to.equal(5);
    });
});
//# sourceMappingURL=granularity.mocha.js.map