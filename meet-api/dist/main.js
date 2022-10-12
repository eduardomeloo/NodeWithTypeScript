"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const restify = require('restify')
const restify = require("restify");
const server = restify.createServer({
    name: 'meet-api',
    version: '1.0.0'
});
server.get('/hello', (req, res, next) => {
    res.json({
        message: 'hello'
    });
    return next();
});
server.listen(3000, () => {
    console.log('API is runnig on http://localhost:3000');
});
