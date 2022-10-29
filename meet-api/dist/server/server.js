"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const restify = require("restify");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const validations_1 = require("./validations");
class Server {
    initializeDb() {
        return __awaiter(this, void 0, void 0, function* () {
            mongoose.Promise = global.Promise;
            return yield mongoose.connect(environment_1.environment.db.url, { autoIndex: false });
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                this.application.use(validations_1.validId);
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
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
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
