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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chronoshift_1 = require("chronoshift");
const immutable_1 = require("immutable");
const immutable_class_tester_1 = require("immutable-class-tester");
//@ts-ignore
const equivalent_1 = __importDefault(require("../../../client/utils/test-utils/equivalent"));
const date_range_1 = require("../date-range/date-range");
const filter_clause_1 = require("../filter-clause/filter-clause");
const time_shift_1 = require("./time-shift");
chai_1.use(equivalent_1.default);
describe("TimeShift", () => {
    it("is an immutable class", () => {
        immutable_class_tester_1.testImmutableClass(time_shift_1.TimeShift, [null, "P1D"]);
    });
});
describe("isValidTimeShift", () => {
    it("should return false for invalid timeshifts", () => {
        chai_1.expect(time_shift_1.isValidTimeShift(""), "empty string").to.be.false;
        chai_1.expect(time_shift_1.isValidTimeShift("1234"), "number").to.be.false;
        chai_1.expect(time_shift_1.isValidTimeShift("1D"), "duration without leading P").to.be.false;
        chai_1.expect(time_shift_1.isValidTimeShift("P1H"), "hour duration without T").to.be.false;
    });
    it("should return true for valid timeshifts", () => {
        chai_1.expect(time_shift_1.isValidTimeShift(null), "<null>").to.be.true;
        chai_1.expect(time_shift_1.isValidTimeShift("PT1H"), "one hour").to.be.true;
        chai_1.expect(time_shift_1.isValidTimeShift("P2D"), "two days").to.be.true;
        chai_1.expect(time_shift_1.isValidTimeShift("P3W"), "three weeks").to.be.true;
        chai_1.expect(time_shift_1.isValidTimeShift("P2M"), "two months").to.be.true;
        chai_1.expect(time_shift_1.isValidTimeShift("P5Y"), "five years").to.be.true;
    });
    describe("constrainToFilter", () => {
        const oneDay = time_shift_1.TimeShift.fromJS("P1D");
        const empty = time_shift_1.TimeShift.empty();
        describe("Fixed time filter", () => {
            it("does not touch if shifted period do not overlap with original", () => {
                const filter = new filter_clause_1.FixedTimeFilterClause({
                    reference: "time",
                    values: immutable_1.List.of(new date_range_1.DateRange({
                        start: new Date("2010-01-01"),
                        end: new Date("2010-01-02")
                    }))
                });
                chai_1.expect(oneDay.constrainToFilter(filter, chronoshift_1.Timezone.UTC)).to.be.equivalent(oneDay);
            });
            it("returns empty time shift if shifted period overlap with original", () => {
                const filter = new filter_clause_1.FixedTimeFilterClause({
                    reference: "time",
                    values: immutable_1.List.of(new date_range_1.DateRange({
                        start: new Date("2010-01-01"),
                        end: new Date("2010-01-03")
                    }))
                });
                chai_1.expect(oneDay.constrainToFilter(filter, chronoshift_1.Timezone.UTC)).to.be.equivalent(empty);
            });
        });
        describe("Relative time filter", () => {
            describe("Latest period", () => {
                it("does not touch if shifted period do not overlap with original", () => {
                    const filter = new filter_clause_1.RelativeTimeFilterClause({
                        reference: "time",
                        period: filter_clause_1.TimeFilterPeriod.LATEST,
                        duration: chronoshift_1.Duration.fromJS("P1D")
                    });
                    chai_1.expect(oneDay.constrainToFilter(filter, chronoshift_1.Timezone.UTC)).to.be.equivalent(oneDay);
                });
                it("returns empty time shift if shifted period overlap with original", () => {
                    const filter = new filter_clause_1.RelativeTimeFilterClause({
                        reference: "time",
                        period: filter_clause_1.TimeFilterPeriod.LATEST,
                        duration: chronoshift_1.Duration.fromJS("P2D")
                    });
                    chai_1.expect(oneDay.constrainToFilter(filter, chronoshift_1.Timezone.UTC)).to.be.equivalent(empty);
                });
            });
            describe("Previous period", () => {
                it("does not touch if shifted period do not overlap with original", () => {
                    const filter = new filter_clause_1.RelativeTimeFilterClause({
                        reference: "time",
                        period: filter_clause_1.TimeFilterPeriod.PREVIOUS,
                        duration: chronoshift_1.Duration.fromJS("P1D")
                    });
                    chai_1.expect(oneDay.constrainToFilter(filter, chronoshift_1.Timezone.UTC)).to.be.equivalent(oneDay);
                });
                it("returns empty time shift if shifted period overlap with original", () => {
                    const filter = new filter_clause_1.RelativeTimeFilterClause({
                        reference: "time",
                        period: filter_clause_1.TimeFilterPeriod.PREVIOUS,
                        duration: chronoshift_1.Duration.fromJS("P2D")
                    });
                    chai_1.expect(oneDay.constrainToFilter(filter, chronoshift_1.Timezone.UTC)).to.be.equivalent(empty);
                });
            });
            describe("Current period", () => {
                it("does not touch if shifted period do not overlap with original", () => {
                    const filter = new filter_clause_1.RelativeTimeFilterClause({
                        reference: "time",
                        period: filter_clause_1.TimeFilterPeriod.CURRENT,
                        duration: chronoshift_1.Duration.fromJS("P1D")
                    });
                    chai_1.expect(oneDay.constrainToFilter(filter, chronoshift_1.Timezone.UTC)).to.be.equivalent(oneDay);
                });
                it("returns empty time shift if shifted period overlap with original", () => {
                    const filter = new filter_clause_1.RelativeTimeFilterClause({
                        reference: "time",
                        period: filter_clause_1.TimeFilterPeriod.CURRENT,
                        duration: chronoshift_1.Duration.fromJS("P2D")
                    });
                    chai_1.expect(oneDay.constrainToFilter(filter, chronoshift_1.Timezone.UTC)).to.be.equivalent(empty);
                });
            });
        });
    });
});
//# sourceMappingURL=time-shift.mocha.js.map