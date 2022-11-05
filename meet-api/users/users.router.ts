import {Router} from '../common/router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import {User} from './users.model'

class UsersRouter extends Router {

    constructor() {
        super()
        this.on('beforeRender', document => {
            document.password = undefined
            //delete document.password
        })
    }

    applyRoutes(application: restify.Server){
        application.get('/users', async (req, resp, next) => {
            User.find()
                .then(this.render(resp, next))
                .catch(next)

        })

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next)
        })

        application.post('/users', (req, resp, next) => {
            let user = new User(req.body) //Cria um novo documento vazio
            user.save()
                .then(this.render(resp, next))
                .catch(err => next(err))
        })

        application.put('/users/:id', async (req, resp, next) => {
            User.replaceOne({_id : req.params.id}, req.body, {new: true, upsert: true})
                .exec().then(result => {
                    if(result.modifiedCount){
                        return User.findById(req.params.id)
                    } else {
                        throw new NotFoundError('Documento não encontrado')
                    }
                }).then(this.render(resp, next))
                  .catch(next)
        })

        application.patch('/users/:id', (req, resp, next) => {
            const options = { new : true }
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next)
        })

        application.del('/users/:id', (req, resp, next) => {
            User.deleteOne({_id: req.params.id}).exec().then(cmdResult => {
                if(cmdResult.deletedCount) {
                    resp.send(204)
                } else {
                    throw new NotFoundError('Documento não encontrado')
                }
                return next()
            }).catch(next)
        })
    }
}

export const usersRouter = new UsersRouter()