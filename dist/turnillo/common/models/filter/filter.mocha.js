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
const immutable_1 = require("immutable");
const plywood_1 = require("plywood");
const data_cube_fixtures_1 = require("../data-cube/data-cube.fixtures");
const filter_clause_1 = require("../filter-clause/filter-clause");
const filter_1 = require("./filter");
describe("Filter", () => {
    it("works in empty case", () => {
        chai_1.expect(filter_1.EMPTY_FILTER.toExpression(data_cube_fixtures_1.DataCubeFixtures.wiki()).toJS()).to.deep.equal({
            op: "literal",
            value: true
        });
    });
    it("add works", () => {
        let filter = filter_1.EMPTY_FILTER;
        const reference = "namespace";
        const $namespace = plywood_1.$(reference);
        const clause = new filter_clause_1.StringFilterClause({ reference, action: filter_clause_1.StringFilterAction.IN, values: immutable_1.Set.of("en") });
        filter = filter.addClause(clause);
        const en = $namespace.overlap(["en"]);
        chai_1.expect(filter.toExpression(data_cube_fixtures_1.DataCubeFixtures.wiki()).toJS(), "lang: en").to.deep.equal(en.toJS());
        filter = filter.setClause(clause.update("values", values => values.add(null)));
        const langNull = $namespace.overlap(["en", null]);
        chai_1.expect(filter.toExpression(data_cube_fixtures_1.DataCubeFixtures.wiki()).toJS(), "lang: null").to.deep.equal(langNull.toJS());
    });
});
//# sourceMappingURL=filter.mocha.js.map