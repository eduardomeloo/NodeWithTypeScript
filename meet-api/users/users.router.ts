import {Router} from '../common/router'
import * as restify from 'restify'
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
            await User.find().then(this.render(resp, next))
        })

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(this.render(resp, next))
        })

        application.post('/users', (req, resp, next) => {
            let user = new User(req.body) //Cria um novo documento vazio
            user.save().then(this.render(resp, next))
        })

        application.put('/users/:id', async (req, resp, next) => {
            await User.replaceOne({_id : req.params.id}, req.body, {new: true, upsert: true})
                .exec().then(result => {
                    if(result.modifiedCount){
                        return User.findById(req.params.id)
                    } else {
                        resp.send(404)
                    }
                }).then(this.render(resp, next))
        })

        application.patch('/users/:id', (req, resp, next) => {
            const options = { new : true }
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
        })

        application.del('/users/:id', (req, resp, next) => {
            User.deleteOne({_id: req.params.id}).exec().then(cmdResult => {
                if(cmdResult.deletedCount) {
                    console.log('localizou')
                    console.log(cmdResult.deletedCount)
                    resp.send(204)
                } else {
                    console.log('Não localizou')
                    console.log(cmdResult.deletedCount)
                    resp.send(404)
                }
                return next()
            })
        })
    }
}

export const usersRouter = new UsersRouter()