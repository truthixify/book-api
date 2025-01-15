"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/example", (req, res) => {
    res.send("This is an example route.");
});
exports.default = router;
