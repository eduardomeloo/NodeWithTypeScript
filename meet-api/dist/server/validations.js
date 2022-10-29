"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validId = void 0;
const mongoose = require("mongoose");
const validId = (req, resp, next) => {
    if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return resp.send(404);
    }
    else {
        return next();
    }
};
exports.validId = validId;
