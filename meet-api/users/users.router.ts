import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {User} from './users.model'

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
            //delete document.password
        })
    }
    /*
    findByEMail = (req, resp, next) => {
        if(req.query.email) {
            User.find({email: req.query.email})
                .then(this.renderAll(resp, next))
                .catch(next)
        } else {
            next()
        }
    }
    */

    findByEMail = (req, resp, next) => {
        if(req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => {
                    if(user) {
                        return [user]
                    } else {
                        return []
                    } 
                })
                .then(this.renderAll(resp, next))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server){
        application.get({path: `${this.basePath}`}, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: this.findAll },
            { version: '2.0.0', handler: [this.findByEMail, this.findAll] }
        ]))
        //application.get({path: '/users', version: '1.0.0'}, this.findAll)
        application.get({path: `${this.basePath}/:id`}, [this.validateId, this.findById])
        application.post({path: `${this.basePath}`}, this.save)
        application.put({path: `${this.basePath}/:id`}, [this.validateId,this.replace])
        application.patch({path: `${this.basePath}/:id`}, [this.validateId,this.update])
        application.del({path: `${this.basePath}/:id`}, [this.validateId,this.delete])
    }
}

export const usersRouter = new UsersRouter()