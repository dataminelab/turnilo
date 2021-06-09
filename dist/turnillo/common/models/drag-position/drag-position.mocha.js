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
const immutable_class_tester_1 = require("immutable-class-tester");
const drag_position_1 = require("./drag-position");
describe("DragPosition", () => {
    it("is an immutable class", () => {
        immutable_class_tester_1.testImmutableClass(drag_position_1.DragPosition, [
            {
                insert: 0
            },
            {
                insert: 2
            },
            {
                replace: 0
            },
            {
                replace: 1
            }
        ]);
    });
});
//# sourceMappingURL=drag-position.mocha.js.map