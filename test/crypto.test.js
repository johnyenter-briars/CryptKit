"use strict";

const assert = require("assert");
const { decrypt, encrypt } = require("../out/crypto");

const roundTripText = "hello\nselected text\n";
assert.strictEqual(decrypt(encrypt(roundTripText, "pw"), "pw"), roundTripText);

console.log("crypto compatibility tests passed");
