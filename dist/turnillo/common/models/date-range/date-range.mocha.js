"use strict";
/*
 * Copyright 2017-2018 Allegro.pl
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chaiDatetime = __importStar(require("chai-datetime"));
const chronoshift_1 = require("chronoshift");
const date_range_1 = require("./date-range");
chai_1.use(chaiDatetime);
function makeRange(startIso, endIso) {
    return new date_range_1.DateRange({
        start: new Date(startIso),
        end: new Date(endIso)
    });
}
const range = makeRange("2010-01-02", "2010-02-12");
describe("DateRange", () => {
    describe("intersects", () => {
        it("handles null values", () => {
            chai_1.expect(range.intersects(null)).to.be.false;
        });
        it("range intersects with contained range", () => {
            const other = makeRange("2010-01-05", "2010-02-10");
            chai_1.expect(range.intersects(other)).to.be.true;
        });
        it("range intersects with overlapping range", () => {
            const other = makeRange("2010-02-05", "2010-03-10");
            chai_1.expect(range.intersects(other)).to.be.true;
        });
        it("range intersects with itself", () => {
            chai_1.expect(range.intersects(range)).to.be.true;
        });
        it("range does not intersect with adjacent range", () => {
            const other = makeRange("2010-02-12", "2010-02-13");
            chai_1.expect(range.intersects(other)).to.be.false;
        });
    });
    describe("shift", () => {
        it("shifts both dates", () => {
            const shifted = range.shift(chronoshift_1.Duration.fromJS("P1D"), chronoshift_1.Timezone.UTC);
            chai_1.expect(shifted.start).to.equalDate(new Date("2010-01-01"));
            chai_1.expect(shifted.end).to.equalDate(new Date("2010-02-11"));
        });
    });
});
//# sourceMappingURL=date-range.mocha.js.map