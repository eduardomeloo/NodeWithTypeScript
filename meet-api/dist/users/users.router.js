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
exports.usersRouter = void 0;
const router_1 = require("../common/router");
const users_model_1 = require("./users.model");
class UsersRouter extends router_1.Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            yield users_model_1.User.find().then(this.render(resp, next));
        }));
        application.get('/users/:id', (req, resp, next) => {
            users_model_1.User.findById(req.params.id).then(this.render(resp, next));
        });
        application.post('/users', (req, resp, next) => {
            let user = new users_model_1.User(req.body); //Cria um novo documento vazio
            user.save().then(this.render(resp, next));
        });
        application.put('/users/:id', (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            yield users_model_1.User.replaceOne({ _id: req.params.id }, req.body, { new: true, upsert: true })
                .exec().then(result => {
                if (result.modifiedCount) {
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    resp.send(404);
                }
            }).then(this.render(resp, next));
        }));
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true };
            users_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next));
        });
        application.del('/users/:id', (req, resp, next) => {
            users_model_1.User.deleteOne({ _id: req.params.id }).exec().then(cmdResult => {
                if (cmdResult.deletedCount) {
                    console.log('localizou');
                    console.log(cmdResult.deletedCount);
                    resp.send(204);
                }
                else {
                    console.log('Não localizou');
                    console.log(cmdResult.deletedCount);
                    resp.send(404);
                }
                return next();
            });
        });
    }
}
exports.usersRouter = new UsersRouter();
