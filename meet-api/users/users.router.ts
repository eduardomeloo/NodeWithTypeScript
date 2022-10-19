import {Router} from '../common/router'
import * as restify from 'restify'
import {User} from './users.model'

class UsersRouter extends Router {
    applyRoutes(application: restify.Server){
        application.get('/users', (req, resp, next) => {
            //resp.json({message: 'users router'})
            User.findAll().then(users => {
                resp.json(users)
                return next()
            })
        })
    }
}

export const usersRouter = new UsersRouter()