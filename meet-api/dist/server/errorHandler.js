"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (req, resp, err, done) => {
    err.toJSON = () => {
        return {
            message: err.message
        };
    };
    switch (err.name) {
        case 'MongoError':
            console.log(err.code);
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
    }
    done();
};
exports.handleError = handleError;
