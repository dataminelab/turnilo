"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_converter_1 = require("./dataminelab/hash-converter");
__exportStar(require("./dataminelab/hash-converter"), exports);
const hash = "N4IgbglgzgrghgGwgLzgFwgewHYgFwhpwBGCApiADTjTxKoY4DKZaG2A5lPqAMaYIEcAA5QyAJUwB3bngBmiMQF9qGALZlkOCgQCiaXgHoAqgBUAwlRByICNGQBOsgNqg0AT2E7CEDVYdkcvggvAHoZAAmAProVupkAAqOWBEuoBEwDuhYuAQJAIwAIlZQ9sL4ALT5qp7eQvalIEoAui3UUMJIaGmEtcGlDhCcVhG+ZNhQOcHYcH7tmA5oPCABQQQQEXF9BGKDZNzUowG8jLkgEfu846PD1F6DmJsETdRIahBLeACsbSC7EPt8K4VoFHOMrsENlY5As1LE8G5tudAnAYHYrGBEDBvC9el5gho4LAAk1mnchthIoUxhMci4ySBhBTIkwFp8QFClEA";
const dataCube = {
    "name": "users",
    "title": "Users",
    "timeAttribute": "created_at",
    "clusterName": "native",
    "defaultSortMeasure": "id",
    "defaultSelectedMeasures": ["id"],
    "source": "users",
    "attributes": [
        {
            "name": "api_key",
            "type": "STRING",
            "nativeType": "CHARACTER VARYING"
        },
        {
            "name": "created_at",
            "type": "TIME",
            "nativeType": "TIMESTAMP WITH TIME ZONE"
        },
        {
            "name": "disabled_at",
            "type": "TIME",
            "nativeType": "TIMESTAMP WITH TIME ZONE"
        },
        {
            "name": "email",
            "type": "STRING",
            "nativeType": "CHARACTER VARYING"
        },
        {
            "name": "groups",
            "type": "SET/STRING",
            "nativeType": "ARRAY/CHARACTER"
        },
        {
            "name": "id",
            "type": "NUMBER",
            "nativeType": "INTEGER"
        },
        {
            "name": "name",
            "type": "STRING",
            "nativeType": "CHARACTER VARYING"
        },
        {
            "name": "org_id",
            "type": "NUMBER",
            "nativeType": "INTEGER"
        },
        {
            "name": "password_hash",
            "type": "STRING",
            "nativeType": "CHARACTER VARYING"
        },
        {
            "name": "profile_image_url",
            "type": "STRING",
            "nativeType": "CHARACTER VARYING"
        },
        {
            "name": "updated_at",
            "type": "TIME",
            "nativeType": "TIMESTAMP WITH TIME ZONE"
        }
    ],
    "dimensions": [
        {
            "name": "api_key",
            "title": "Api Key",
            "formula": "$api_key"
        },
        {
            "name": "created_at",
            "title": "Created At",
            "formula": "$created_at",
            "kind": "time"
        },
        {
            "name": "details",
            "title": "Details",
            "formula": "$details"
        },
        {
            "name": "disabled_at",
            "title": "Disabled At",
            "formula": "$disabled_at",
            "kind": "time"
        },
        {
            "name": "email",
            "title": "Email",
            "formula": "$email"
        },
        {
            "name": "groups",
            "title": "Groups",
            "formula": "$groups"
        },
        {
            "name": "name",
            "title": "Name",
            "formula": "$name"
        },
        {
            "name": "password_hash",
            "title": "Password Hash",
            "formula": "$password_hash"
        },
        {
            "name": "profile_image_url",
            "title": "Profile Image Url",
            "formula": "$profile_image_url"
        },
        {
            "name": "updated_at",
            "title": "Updated At",
            "formula": "$updated_at",
            "kind": "time"
        }
    ],
    "measures": [
        {
            "name": "id",
            "title": "Id",
            "formula": "$main.sum($id)"
        },
        {
            "name": "org_id",
            "title": "Org",
            "formula": "$main.sum($org_id)"
        }
    ]
};
const res = hash_converter_1.hashToExpression(hash, dataCube);
console.log(JSON.stringify(res, null, 2));
//# sourceMappingURL=index.js.map