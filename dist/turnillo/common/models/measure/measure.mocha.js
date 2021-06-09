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
const plywood_1 = require("plywood");
const measure_1 = require("./measure");
describe("Measure", () => {
    it("is an immutable class", () => {
        immutable_class_tester_1.testImmutableClass(measure_1.Measure, [
            {
                name: "price",
                title: "Price",
                formula: "$main.sum($price)"
            },
            {
                name: "avg_price",
                title: "Average Price",
                formula: "$main.average($price)"
            },
            {
                name: "latency",
                title: "Latency",
                units: "ms",
                formula: "$main.sum($latency)"
            },
            {
                name: "item_sum",
                title: "Items",
                formula: "$main.sum($item)",
                transformation: "none"
            },
            {
                name: "items_of_parent",
                title: "Items (% of parent)",
                formula: "$main.sum($item)",
                transformation: "percent-of-parent"
            },
            {
                name: "items_of_total",
                title: "Items (% of total)",
                formula: "$main.sum($item)",
                transformation: "percent-of-total"
            }
        ]);
    });
    describe("back compat", () => {
        it("upgrades expression to formula", () => {
            chai_1.expect(measure_1.Measure.fromJS({
                name: "avg_price",
                title: "Average Price",
                expression: "$main.average($price)"
            }).toJS()).to.deep.equal({
                name: "avg_price",
                title: "Average Price",
                formula: "$main.average($price)"
            });
        });
    });
    describe(".measuresFromAttributeInfo", () => {
        it("works with sum", () => {
            const attribute = plywood_1.AttributeInfo.fromJS({
                name: "price",
                type: "NUMBER",
                unsplitable: true,
                maker: {
                    action: "sum",
                    expression: {
                        name: "price",
                        op: "ref"
                    }
                }
            });
            const measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((m => m.toJS()));
            chai_1.expect(measures).to.deep.equal([
                {
                    name: "price",
                    title: "Price",
                    formula: "$main.sum($price)"
                }
            ]);
        });
        it("works with min", () => {
            const attribute = plywood_1.AttributeInfo.fromJS({
                name: "price",
                type: "NUMBER",
                unsplitable: true,
                maker: {
                    action: "min",
                    expression: {
                        name: "price",
                        op: "ref"
                    }
                }
            });
            const measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((m => m.toJS()));
            chai_1.expect(measures).to.deep.equal([
                {
                    name: "price",
                    title: "Price",
                    formula: "$main.min($price)"
                }
            ]);
        });
        it("works with max", () => {
            const attribute = plywood_1.AttributeInfo.fromJS({
                name: "price",
                type: "NUMBER",
                unsplitable: true,
                maker: {
                    action: "max",
                    expression: {
                        name: "price",
                        op: "ref"
                    }
                }
            });
            const measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((m => m.toJS()));
            chai_1.expect(measures).to.deep.equal([
                {
                    name: "price",
                    title: "Price",
                    formula: "$main.max($price)"
                }
            ]);
        });
        it("works with approximate histogram", () => {
            const attribute = plywood_1.AttributeInfo.fromJS({
                name: "delta_histogram",
                nativeType: "approximateHistogram",
                type: "NUMBER"
            });
            const measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((m => m.toJS()));
            chai_1.expect(measures).to.deep.equal([
                {
                    name: "delta_histogram_p98",
                    title: "Delta Histogram P98",
                    formula: "$main.quantile($delta_histogram,0.98)"
                }
            ]);
        });
        it("works with quantiles double sketch", () => {
            const attribute = plywood_1.AttributeInfo.fromJS({
                name: "delta_quantiles",
                nativeType: "quantilesDoublesSketch",
                type: "NUMBER"
            });
            const measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((m => m.toJS()));
            chai_1.expect(measures).to.deep.equal([
                {
                    name: "delta_quantiles_p98",
                    title: "Delta Quantiles P98",
                    formula: "$main.quantile($delta_quantiles,0.98)"
                }
            ]);
        });
        it("works with unique", () => {
            const attribute = plywood_1.AttributeInfo.fromJS({
                name: "unique_page",
                nativeType: "hyperUnique",
                type: "STRING"
            });
            const measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((m => m.toJS()));
            chai_1.expect(measures).to.deep.equal([
                {
                    name: "unique_page",
                    title: "Unique Page",
                    formula: "$main.countDistinct($unique_page)"
                }
            ]);
        });
        it("works with theta", () => {
            const attribute = plywood_1.AttributeInfo.fromJS({
                name: "page_theta",
                nativeType: "thetaSketch",
                type: "STRING"
            });
            const measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((m => m.toJS()));
            chai_1.expect(measures).to.deep.equal([
                {
                    name: "page_theta",
                    title: "Page Theta",
                    formula: "$main.countDistinct($page_theta)"
                }
            ]);
        });
        it("works with hll", () => {
            const attribute = plywood_1.AttributeInfo.fromJS({
                name: "page_hll",
                nativeType: "HLLSketch",
                type: "STRING"
            });
            const measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((m => m.toJS()));
            chai_1.expect(measures).to.deep.equal([
                {
                    name: "page_hll",
                    title: "Page Hll",
                    formula: "$main.countDistinct($page_hll)"
                }
            ]);
        });
    });
    // TODO: move to ConcreteSeries !!!
    describe.skip("toApplyExpression", () => {
        //
        // describe("no transformation", () => {
        //   const nestingLevels = [0, 1, 99];
        //
        //   nestingLevels.forEach(nestingLevel => {
        //     it(`creates simple formula expression at level: ${nestingLevel}`, () => {
        //       const applyExpression = MeasureFixtures.noTransformationMeasure().toApplyExpression(nestingLevel);
        //       expect(applyExpression.toJS()).to.deep.equal(MeasureFixtures.applyWithNoTransformation());
        //     });
        //   });
        // });
        //
        // describe("percent-of-parent transformation", () => {
        //   const tests = [
        //     { nestingLevel: 0, expression: MeasureFixtures.applyWithTransformationAtRootLevel() },
        //     { nestingLevel: 1, expression: MeasureFixtures.applyWithTransformationAtLevel(1) },
        //     { nestingLevel: 99, expression: MeasureFixtures.applyWithTransformationAtLevel(1) }
        //   ];
        //
        //   tests.forEach(test => {
        //     it(`creates correct formula expression at level: ${test.nestingLevel}`, () => {
        //       const applyExpression = MeasureFixtures.percentOfParentMeasure().toApplyExpression(test.nestingLevel);
        //       expect(applyExpression.toJS()).to.deep.equal(test.expression);
        //     });
        //   });
        // });
        //
        // describe("percent-of-total transformation", () => {
        //   const tests = [
        //     { nestingLevel: 0, expression: MeasureFixtures.applyWithTransformationAtRootLevel() },
        //     { nestingLevel: 1, expression: MeasureFixtures.applyWithTransformationAtLevel(1) },
        //     { nestingLevel: 99, expression: MeasureFixtures.applyWithTransformationAtLevel(99) }
        //   ];
        //
        //   tests.forEach(test => {
        //     it(`creates correct formula expression at level: ${test.nestingLevel}`, () => {
        //       const applyExpression = MeasureFixtures.percentOfTotalMeasure().toApplyExpression(test.nestingLevel);
        //       expect(applyExpression.toJS()).to.deep.equal(test.expression);
        //     });
        //   });
        // });
    });
});
//# sourceMappingURL=measure.mocha.js.map