"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const request = require("supertest");
let address = global.address;
test('get /reviews', () => {
    return request(address)
        .get('/reviews')
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.items).toBeInstanceOf(Array);
    });
});
