"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const model_router_1 = require("../common/model-router");
const restify = require("restify");
const users_model_1 = require("./users.model");
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEMail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => user ? [user] : [])
                    .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        application.get({ path: `${this.basePath}` }, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: [(0, authz_handler_1.authorize)('admin'), this.findAll] },
            { version: '2.0.0', handler: [
                    (0, authz_handler_1.authorize)('admin'),
                    this.findByEMail,
                    this.findAll
                ] }
        ]));
        application.get({ path: `${this.basePath}/:id` }, [(0, authz_handler_1.authorize)('admin'), this.validateId, this.findById]);
        application.post({ path: `${this.basePath}` }, [(0, authz_handler_1.authorize)('admin'), this.save]);
        application.put({ path: `${this.basePath}/:id` }, [(0, authz_handler_1.authorize)('admin'), this.validateId, this.replace]);
        application.patch({ path: `${this.basePath}/:id` }, [(0, authz_handler_1.authorize)('admin'), this.validateId, this.update]);
        application.del({ path: `${this.basePath}/:id` }, [(0, authz_handler_1.authorize)('admin'), this.validateId, this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
