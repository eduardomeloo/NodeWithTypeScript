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
require("jest");
const request = require("supertest");
const server_1 = require("../server/server");
const environment_1 = require("../common/environment");
const users_router_1 = require("./users.router");
const users_model_1 = require("./users.model");
let server;
beforeAll(() => {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([users_router_1.usersRouter])
        .then(() => users_model_1.User.remove({}).exec())
        .catch(console.error);
});
test('get /users', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield request('http://localhost:3001')
        .get('/users');
    expect(response.status).toBe(200);
    expect(response.body.items).toBeInstanceOf(Array);
}));
test('post /users', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield request('http://localhost:3001')
        .post('/users')
        .send({
        name: 'Junesco',
        email: 'junesco@josefino.com',
        password: '123456',
        cpf: '756.581.158-09'
    });
    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe('Junesco');
    expect(response.body.email).toBe('junesco@josefino.com');
    expect(response.body.cpf).toBe('756.581.158-09');
    expect(response.body.password).toBeUndefined();
}));
