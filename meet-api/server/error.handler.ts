//import * as restify from 'restify'

export const handleError = (req, res, err, done) => {
   // console.log(err.message)
  //  console.log(err.name)
   // err = JSON.parse(JSON.stringify(err))
    
    if(err.name !== undefined)  {
        switch(err.name) {
            case 'MongoServerError':
                if(err.code === 11000) {
                    err.statusCode = 400
                    res.send(err.statusCode, {
                        name: err.name,
                        message: err.message
                    })
                }
                
                break
            case 'ValidationError':
                err.statusCode = 400
                const messages: any[] = []
                for(let name in err.errors){
                    messages.push({message: err.errors[name].message})
                }
                res.send(err.statusCode, {
                    message: 'Validation error while processing your request',
                    errors: messages
                })
                break
        }
    } else if(err.code === 11000) {
        err.statusCode = 400
    }
    
    /*
    res.send(err.statusCode, {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
    })
    */

    return done();
};