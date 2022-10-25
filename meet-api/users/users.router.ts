import {Router} from '../common/router'
import * as restify from 'restify'
import {User} from './users.model'

class UsersRouter extends Router {
    applyRoutes(application: restify.Server){
        application.get('/users', async (req, resp, next) => {
            //resp.json({message: 'users router'})

            await User.find({}).then(users => {
                resp.json(users)
                return next()
            }).catch(err => console.log(err))
        })

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(user => {
                if(user) {
                    resp.json(user)
                    return next()
                }

                resp.send(404)
                return next()
            })
        })
    }
}

export const usersRouter = new UsersRouter()