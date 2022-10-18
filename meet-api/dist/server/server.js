"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const restify = require("restify");
const environment_1 = require("../common/environment");
class Server {
    initRoutes() {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.get('/hello', (req, res, next) => {
                    res.status(200);
                    res.setHeader('Content-Type', 'application/json');
                    res.send({ message: 'hello' });
                    //res.json({message:'hello'})
                    return next();
                });
                this.application.get('/info', (req, res, next) => {
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
                this.application.get('/arrayCallbacksNext', [(req, res, next) => {
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
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap() {
        return this.initRoutes().then(() => this);
    }
}
exports.Server = Server;
