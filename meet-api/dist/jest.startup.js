"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const reviews_router_1 = require("./reviews/reviews.router");
const users_model_1 = require("./users/users.model");
const reviews_model_1 = require("./reviews/reviews.model");
const restaurants_model_1 = require("./restaurants/restaurants.model");
const restaurants_router_1 = require("./restaurants/restaurants.router");
require('dotenv').config();
let server;
const beforeAllTests = () => {
    environment_1.environment.db.url = environment_1.environment.db.url_teste || 'mongodb://localhost/meat-api-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT_TESTE || 5001;
    console.log(environment_1.environment.db.url);
    console.log(environment_1.environment.server.port);
    console.log(process.env.SERVER_PORT_TESTE);
    console.log(process.env.DB_URL_TESTE);
    console.log(environment_1.environment.db.url_teste);
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
        reviews_router_1.reviewsRouter,
        restaurants_router_1.restaurantsRouter
    ])
        .then(() => users_model_1.User.deleteMany({}))
        .then(() => {
        let admin = new users_model_1.User();
        admin.name = 'admin';
        admin.email = 'admin@email.com';
        admin.password = '123456';
        admin.profiles = ['admin', 'user'];
        return admin.save();
    })
        .then(() => reviews_model_1.Review.deleteMany({}))
        .then(() => restaurants_model_1.Restaurant.deleteMany({}));
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
