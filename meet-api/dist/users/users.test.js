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
let address = global.address;
test('get /users', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield request(address)
        .get('/users');
    expect(response.status).toBe(200);
    expect(response.body.items).toBeInstanceOf(Array);
}));
test('post /users', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield request(address)
        .post('/users')
        .send({
        name: 'usuario1',
        email: 'usuario1@email.com',
        password: '123456',
        cpf: '756.581.158-09'
    });
    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe('usuario1');
    expect(response.body.email).toBe('usuario1@email.com');
    expect(response.body.cpf).toBe('756.581.158-09');
    expect(response.body.password).toBeUndefined();
}));
test('get /users/aaaaa - not found', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield request(address)
        .get('/users/aaaaa');
    expect(response.status).toBe(404);
}));
test('patch /users/:id', () => __awaiter(void 0, void 0, void 0, function* () {
    return request(address)
        .post('/users')
        .send({
        name: 'usuario2',
        email: 'usuario2@email.com',
        password: '123456'
    })
        .then(res => request(address)
        .patch(`/users/${res.body._id}`)
        .send({
        name: 'usuario2 - patch'
    }))
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('usuario2 - patch');
        expect(response.body.email).toBe('usuario2@email.com');
        expect(response.body.password).toBeUndefined();
    });
}));
