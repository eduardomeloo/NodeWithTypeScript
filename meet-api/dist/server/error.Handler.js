"use strict";
//import * as restify from 'restify'
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (req, res, err, done) => {
    err = JSON.parse(JSON.stringify(err));
    console.log(err);
    switch (err.name) {
        case 'MongoServerError':
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        case 'ValidationError':
            err.statusCode = 400;
            const messages = [];
            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message });
            }
            res.send(err.statusCode, {
                errors: messages
            });
            break;
    }
    /*
    res.send(err.statusCode, {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
    })
    */
    return done();
};
exports.handleError = handleError;
