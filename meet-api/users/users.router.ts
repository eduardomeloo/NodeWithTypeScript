import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {User} from './users.model'
import { authenticate } from '../security/auth.handler'
import { authorize } from '../security/authz.handler'

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
            //delete document.password
        })
    }

    findByEMail = (req, resp, next) => {
        if(req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => user ? [user] : [] )
                .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server){
        application.get({path: `${this.basePath}`}, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: [authorize('admin'), this.findAll] },
            { version: '2.0.0', handler: [
                authorize('admin'), 
                this.findByEMail, 
                this.findAll
            ]}
        ]))
        //application.get({path: '/users', version: '1.0.0'}, this.findAll)
        application.get({path: `${this.basePath}/:id`}, [authorize('admin'), this.validateId, this.findById])
        application.post({path: `${this.basePath}`}, [authorize('admin'), this.save])
        application.put({path: `${this.basePath}/:id`}, [authorize('admin'), this.validateId,this.replace])
        application.patch({path: `${this.basePath}/:id`}, [authorize('admin'), this.validateId,this.update])
        application.del({path: `${this.basePath}/:id`}, [authorize('admin'), this.validateId,this.delete])
        application.post(`${this.basePath}/authenticate`, authenticate)
    }
}

export const usersRouter = new UsersRouter()