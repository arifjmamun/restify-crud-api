import * as restify from 'restify';
import * as mongoose from 'mongoose';
import * as swaggerRoutes from 'swagger-routes';
import * as bunyan from 'bunyan';
import * as corsMiddleware from 'restify-cors-middleware';
import * as frameguard from 'frameguard';

import config from './config';

// setup logger
const logger = bunyan.createLogger({ name: 'CRUD API', level: 'debug' });

// create server
const server = restify.createServer({
  name: 'CRUD APIs',
  log: logger
});

// Middleware
server.use(frameguard({ action: 'sameorigin' }));
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.requestLogger());
server.use(restify.plugins.gzipResponse());

server.pre(function(req, res, next) {
  if (config.ENV === 'development') {
      res.header('Access-Control-Allow-Origin', '*');
      console.log('server.pre for', req.url);
  }
  return next();
});

// handle the favicon.ico request
server.get('/favicon.ico', function(req, res, next) {
  res.send(200);
  return next();
});


/* Handle CORS */
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: [],
  exposeHeaders: []
});

server.pre(cors.preflight);
server.use(cors.actual);


/**
 * Map restify routes to the swagger API specification
 * https://github.com/mikestead/swagger-routes
 */
swaggerRoutes(server, {
  api: './dist/definitions/api-definitions.json',
  handlers: {
    path: `./dist/handlers/${config.CURRENT_VERSION}`,
    template: './dist/definitions/template/handler.mustache', // N/A for TypeScript project setup yet
    getTemplateView: (operation: any) => operation, // define the object to be rendered by your template
    generate: false, // N/A for TypeScript project setup yet
    group: false // N/A for TypeScript project setup yet
  }
});

server.listen(config.PORT, () => {
  logger.info('API services are running on', config.PORT, 'in', config.ENV, 'mode');
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

const db = mongoose.connection;

db.on('error', error => {
  console.log(error);
});

db.once('open', () => {
  console.log(`Server started on port ${config.PORT}`);
});

export default server;
