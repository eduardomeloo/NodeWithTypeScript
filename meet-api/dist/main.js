"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const restify = require('restify')
const restify = require("restify");
const server = restify.createServer({
    name: 'meet-api',
    version: '1.0.0'
});
server.use(restify.plugins.queryParser());
server.get('/hello', (req, res, next) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send({ message: 'hello' });
    //res.json({message:'hello'})
    return next();
});
server.get('/info', (req, res, next) => {
    res.json({
        browser: req.userAgent(),
        method: req.method,
        url1: req.href(),
        url2: req.url,
        path: req.path(),
        params: req.params,
        query: req.query
    });
    return next();
});
server.get('/arrayCallbacksNext', [(req, res, next) => {
        if (req.userAgent() && req.userAgent().includes('Chrome/106')) {
            //res.status(400)
            //res.json({message : 'Please, update your browser'})
            //return next(false)
            let error = new Error();
            error.statusCode = 400;
            error.message = 'Please, update your browser';
            return next(error);
        }
        return next();
    }, (req, res, next) => {
        res.json({
            browser: req.userAgent(),
            method: req.method,
            url1: req.href(),
            url2: req.url,
            path: req.path(),
            params: req.params,
            query: req.query
        });
        return next();
    }]);
server.listen(3000, () => {
    console.log('API is runnig on http://localhost:3000');
});
