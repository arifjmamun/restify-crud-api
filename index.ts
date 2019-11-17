import * as restify from 'restify';
import * as mongoose from 'mongoose';
import config from './config';
import customerRoutes from './routes/customers';

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });
});

const db = mongoose.connection;

db.on('error', error => {
  console.log(error);
});

db.once('open', () => {
  customerRoutes(server);
  console.log(`Server started on port ${config.PORT}`);
});
