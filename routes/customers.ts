import * as restify from 'restify';
import * as errors from 'restify-errors';

import { Customer } from '../models/Customer';

export default (server: restify.Server) => {
  // Get customers
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (error) {
      return next(new errors.InvalidContentError(error));
    }
  });

  // Add customer
  server.post('/customers', async (req, res, next) => {
    try {
      if (!req.is('application/json')) {
        return next(new errors.InvalidContentError('Expects \'application/json\''));
      }

      const { name, email, balance } = req.body;
      const customer = new Customer({
        name,
        email,
        balance
      });
      const newCustomer = await customer.save();
      res.send(201);
      next();
    } catch (error) {
      return next(new errors.InternalError(error.message));
    }
  });
};
