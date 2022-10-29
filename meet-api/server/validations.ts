import * as restify from 'restify'
import * as mongoose from 'mongoose'

export const validId = (req: restify.Request, resp: restify.Response, next) => {
    if( req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return resp.send(404);
    } else {
        return next()
    }
    
}