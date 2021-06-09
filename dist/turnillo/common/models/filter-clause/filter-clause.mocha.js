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
const immutable_1 = require("immutable");
const date_range_1 = require("../date-range/date-range");
const filter_clause_1 = require("./filter-clause");
describe("FilterClause", () => {
    describe("evaluate", () => {
        it("works with now for previous", () => {
            const previousRelative = new filter_clause_1.RelativeTimeFilterClause({ reference: "time", period: filter_clause_1.TimeFilterPeriod.PREVIOUS, duration: chronoshift_1.Duration.fromJS("P1D") });
            const now = new Date("2016-01-15T11:22:33Z");
            const maxTime = new Date("2016-01-15T08:22:00Z");
            const previousFixed = new filter_clause_1.FixedTimeFilterClause({
                reference: "time",
                values: immutable_1.List.of(new date_range_1.DateRange({
                    start: new Date("2016-01-14"),
                    end: new Date("2016-01-15")
                }))
            });
            chai_1.expect(previousRelative.evaluate(now, maxTime, chronoshift_1.Timezone.UTC)).to.be.equivalent(previousFixed);
        });
        it("works with now for current", () => {
            const currentRelative = new filter_clause_1.RelativeTimeFilterClause({ reference: "time", period: filter_clause_1.TimeFilterPeriod.CURRENT, duration: chronoshift_1.Duration.fromJS("P1D") });
            const now = new Date("2016-01-15T11:22:33Z");
            const maxTime = new Date("2016-01-15T08:22:00Z");
            const currentFixed = new filter_clause_1.FixedTimeFilterClause({
                reference: "time",
                values: immutable_1.List.of(new date_range_1.DateRange({
                    start: new Date("2016-01-15"),
                    end: new Date("2016-01-16")
                }))
            });
            chai_1.expect(currentRelative.evaluate(now, maxTime, chronoshift_1.Timezone.UTC)).to.be.equivalent(currentFixed);
        });
        it("works with maxTime for latest", () => {
            const relativeClause = new filter_clause_1.RelativeTimeFilterClause({ reference: "time", period: filter_clause_1.TimeFilterPeriod.LATEST, duration: chronoshift_1.Duration.fromJS("P1D") });
            const now = new Date("2016-01-15T11:22:33Z");
            const maxTime = new Date("2016-01-15T08:22:00Z");
            const fixedClause = new filter_clause_1.FixedTimeFilterClause({
                reference: "time",
                values: immutable_1.List.of(new date_range_1.DateRange({
                    end: new Date("2016-01-15T08:23:00Z"),
                    start: new Date("2016-01-14T08:23:00Z")
                }))
            });
            chai_1.expect(relativeClause.evaluate(now, maxTime, chronoshift_1.Timezone.UTC)).to.be.equivalent(fixedClause);
        });
    });
});
//# sourceMappingURL=filter-clause.mocha.js.map