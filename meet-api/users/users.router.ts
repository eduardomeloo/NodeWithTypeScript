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

        application.post('/users', (req, resp, next) => {
            let user = new User(req.body) //Cria um novo documento vazio
            user.save().then(user => {
                user.password = undefined
                resp.json(user)
                return next()
            })
        })

        application.put('/users/:id', async (req, resp, next) => {
            await User.replaceOne({_id : req.params.id}, req.body, {new: true, upsert: true})
                .exec().then(result => {
                    if(result.modifiedCount){
                        return User.findById(req.params.id)
                    } else {
                        resp.send(404)
                    }
                }).then(user => {
                    resp.json(user)
                    return next()
                })
        })

        application.patch('/users/:id', (req, resp, next) => {
            const options = { new : true }
            User.findByIdAndUpdate(req.params.id, req.body, options).then(user => {
                if(user) {
                    resp.json(user)
                    return next()
                } else {
                    resp.send(404)
                    return next()
                }
            })
        })
    }
}

export const usersRouter = new UsersRouter()