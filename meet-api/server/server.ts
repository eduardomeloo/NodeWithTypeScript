import * as fs from 'fs'
import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { environment } from '../common/environment'
import {Router} from '../common/router'
import {mergePatchBodyParser} from './merge-patch.parser'
import {handleError} from './error.handler'
import { tokenParser } from '../security/token.parser'
export class Server {

    application: restify.Server

    async initializeDb() {
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url, { autoIndex: false })
    }

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject) => {

            try {
                
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0',
                    certificate: fs.readFileSync('../security/keys/cert.pem'),
                    key: fs.readFileSync('../security/keys/key.pem')
                })

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
                this.application.use(tokenParser)

                for(let router of routers) {
                    router.applyRoutes(this.application)
                }
                
                this.application.get('/info', (req, res, next) => {
                    res.json({
                        browser: req.userAgent(),
                        method:  req.method,
                        url1:    req.href(),
                        url2:    req.url,
                        path:    req.path(),
                        params:  req.params,
                        query:   req.query
                    })
                    return next()
                })
                
                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

                this.application.on('restifyError', handleError)
                
            } catch (error) {
                reject(error)
            }
        })
    }
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
                this.initRoutes(routers).then(() => this))
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}