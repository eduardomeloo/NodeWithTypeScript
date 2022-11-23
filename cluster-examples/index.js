
var restify = require('restify');

const server = restify.createServer({
  name: 'myapptest',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.get('/', (req, res, next) => {
    //for(let i = 0; i<= 1e8; i++){} Chamada sincrona para teste
    setTimeout(() => {
        res.json({pid: process.pid, echo: req.query})
    }, 500)
    
})

server.listen(4000, function () {
  console.log('%s listening at %s', server.name, server.url);
});