import * as jestCli from 'jest-cli'
import { Server } from './server/server'
import { environment } from './common/environment'
import { usersRouter } from './users/users.router'
import { reviewsRouter } from './reviews/reviews.router'
import { User } from './users/users.model'
import { Review } from './reviews/reviews.model'
import { Restaurant } from './restaurants/restaurants.model'
import { restaurantsRouter } from './restaurants/restaurants.router'

let server: Server

const beforeAllTests = () => {
    environment.db.url = environment.db.url_teste || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT_TESTE || 5001
    console.log(environment.db.url)
    console.log(environment.server.port)
    server = new Server()
    return server.bootstrap([
        usersRouter, 
        reviewsRouter,
        restaurantsRouter
    ])
    .then(() => User.deleteMany({}))
    .then(() => {
        let admin = new User()
        admin.name = 'admin'
        admin.email = 'admin@email.com'
        admin.password = '123456'
        admin.profiles = ['admin', 'user']
        return admin.save()
    })
    .then(() => Review.deleteMany({}))
    .then(() => Restaurant.deleteMany({}))
    
}

const afterAllTests = () => {
    return server.shutdown()
}

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error)