import {Server} from './server/server'
import {usersRouter} from './users/users.router'
import { restaurantsRouter } from './restaurants/restaurants.router'
import {reviewsRouter} from './reviews/reviews.router'
require('dotenv').config()

const server = new Server()

server.bootstrap([
    usersRouter,
    restaurantsRouter,
    reviewsRouter
]).then(server => {
    console.log('API is runnig on:' , server.application.address())
}).catch(error => {
    console.log('Server failed to start')
    console.error(error)
    process.exit(1) //saída anormal
})