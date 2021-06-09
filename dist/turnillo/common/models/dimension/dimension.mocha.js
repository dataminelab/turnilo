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
const immutable_class_tester_1 = require("immutable-class-tester");
const dimension_1 = require("./dimension");
describe("Dimension", () => {
    it("is an immutable class", () => {
        immutable_class_tester_1.testImmutableClass(dimension_1.Dimension, [
            {
                name: "country",
                title: "important countries",
                formula: "$country",
                kind: "string",
                granularities: [5, 50, 500, 800, 1000],
                sortStrategy: "self"
            },
            {
                name: "country",
                title: "important countries",
                formula: "$country",
                kind: "string",
                url: "https://www.country.com/%s",
                bucketedBy: 1,
                bucketingStrategy: dimension_1.BucketingStrategy.defaultBucket
            },
            {
                name: "time",
                title: "time",
                formula: "$time",
                kind: "time",
                url: "http://www.time.com/%s",
                granularities: ["PT1M", "P6M", "PT6H", "P1D", "P1W"]
            },
            {
                name: "time",
                title: "time",
                formula: "$time",
                kind: "time",
                url: "http://www.time.com/%s",
                granularities: ["PT1M", "P6M", "PT6H", "P1D", "P1W"],
                bucketedBy: "PT6H"
            }
        ]);
    });
    describe("back compat", () => {
        it("upgrades expression to formula", () => {
            chai_1.expect(dimension_1.Dimension.fromJS({
                name: "country",
                title: "important countries",
                expression: "$country",
                kind: "string"
            }).toJS()).to.deep.equal({
                name: "country",
                title: "important countries",
                formula: "$country",
                kind: "string"
            });
        });
        /* TODO: check the correctness of the test */
        /*    it('neverBucket -> default no bucket', () => {
              expect(Dimension.fromJS({
                name: 'country',
                title: 'important countries',
                expression: '$country',
                kind: 'string',
                bucketingStrategy: 'neverBucket'
              } as any).toJS()).to.deep.equal({
                name: 'country',
                title: 'important countries',
                formula: '$country',
                kind: 'string',
                bucketingStrategy: 'defaultNoBucket'
              });
            });*/
        /* TODO: check the correctness of the test */
        /*    it('alwaysBucket -> default bucket', () => {
              expect(Dimension.fromJS({
                name: 'country',
                title: 'important countries',
                expression: '$country',
                kind: 'string',
                bucketingStrategy: 'alwaysBucket'
              } as any).toJS()).to.deep.equal({
                name: 'country',
                title: 'important countries',
                formula: '$country',
                kind: 'string',
                bucketingStrategy: 'defaultBucket'
              });
            });*/
    });
    describe("errors", () => {
        it("throws on invalid type", () => {
            var dimJS = {
                name: "mixed_granularities",
                title: "Mixed Granularities",
                kind: "string",
                granularities: [5, 50, "P1W", 800, 1000]
            };
            chai_1.expect(() => { dimension_1.Dimension.fromJS(dimJS); }).to.throw("granularities must have the same type of actions");
            var dimJS2 = {
                name: "bad type",
                title: "Bad Type",
                kind: "string",
                granularities: [false, true, true, false, false]
            };
            chai_1.expect(() => { dimension_1.Dimension.fromJS(dimJS2); }).to.throw("input should be number or Duration");
        });
    });
});
//# sourceMappingURL=dimension.mocha.js.map