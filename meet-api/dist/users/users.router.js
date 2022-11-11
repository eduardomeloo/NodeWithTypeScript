"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const model_router_1 = require("../common/model-router");
const restify = require("restify");
const users_model_1 = require("./users.model");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        /*
        findByEMail = (req, resp, next) => {
            if(req.query.email) {
                User.find({email: req.query.email})
                    .then(this.renderAll(resp, next))
                    .catch(next)
            } else {
                next()
            }
        }
        */
        this.findByEMail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    if (user) {
                        return [user];
                    }
                    else {
                        return [];
                    }
                })
                    .then(this.renderAll(resp, next))
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
            { version: '1.0.0', handler: this.findAll },
            { version: '2.0.0', handler: [this.findByEMail, this.findAll] }
        ]));
        //application.get({path: '/users', version: '1.0.0'}, this.findAll)
        application.get({ path: `${this.basePath}/:id` }, [this.validateId, this.findById]);
        application.post({ path: `${this.basePath}` }, this.save);
        application.put({ path: `${this.basePath}/:id` }, [this.validateId, this.replace]);
        application.patch({ path: `${this.basePath}/:id` }, [this.validateId, this.update]);
        application.del({ path: `${this.basePath}/:id` }, [this.validateId, this.delete]);
    }
}
exports.usersRouter = new UsersRouter();
