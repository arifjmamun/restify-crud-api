import 'reflect-metadata';
import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import { Container } from 'inversify';
import { interfaces, TYPE, InversifyRestifyServer } from 'inversify-restify-utils';
import * as mongoose from 'mongoose';
import * as bunyan from 'bunyan';
import * as frameguard from 'frameguard';
import * as restifySwaggerJsdoc from 'restify-swagger-jsdoc';

import config from './config';
import { Services } from './constants/types';
import { CustomerController } from './controllers';
import { CustomerService } from './services';

// load everything needed to the Container
let container = new Container();
container
  .bind<interfaces.Controller>(TYPE.Controller)
  .to(CustomerController)
  .inRequestScope()
  .whenTargetNamed('CustomerController');
container
  .bind<CustomerService>(Services.CustomerService)
  .to(CustomerService)
  .inRequestScope();

// setup logger
const logger = bunyan.createLogger({ name: 'CRUD API', level: 'debug' });

// create server
const inversifyServer = new InversifyRestifyServer(container, { name: 'CRUD APIs', log: logger });
const server = inversifyServer
  .setConfig((app: restify.Server) => {
    app.use(frameguard({ action: 'sameorigin' }));
    app.use(restify.plugins.bodyParser());
    app.use(restify.plugins.queryParser());
    app.use(restify.plugins.requestLogger());
    app.use(restify.plugins.gzipResponse());

    app.pre(function(req, res, next) {
      if (config.ENV === 'development') {
        res.header('Access-Control-Allow-Origin', '*');
        console.log('server.pre for', req.url);
      }
      return next();
    });

    // handle the favicon.ico request
    app.get('/favicon.ico', function(req, res, next) {
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

    app.pre(cors.preflight);
    app.use(cors.actual);
  })
  .build();

// const expressSwagger = require('express-swagger-generator')(server);

// let options = {
//     swaggerDefinition: {
//         info: {
//             description: 'This is a sample server',
//             title: 'Swagger',
//             version: '1.0.0',
//         },
//         host: `localhost:${config.PORT}`,
//         basePath: '/',
//         produces: [
//             "application/json",
//             "application/xml"
//         ],
//         schemes: ['http', 'https'],
//         securityDefinitions: {
//             JWT: {
//                 type: 'apiKey',
//                 in: 'header',
//                 name: 'Authorization',
//                 description: "",
//             }
//         }
//     },
//     basedir: __dirname, //app absolute path
//     files: ['./routes/**/*.js'] //Path to the API handle folder
// };
// expressSwagger(options);

restifySwaggerJsdoc.createSwaggerPage({
  title: 'API documentation', // Page title
  version: '1.0.0', // Server version
  server: server, // Restify server instance created with restify.createServer()
  path: '/docs/swagger' // Public url where the swagger page will be available
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