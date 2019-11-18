import * as restify from 'restify';
import * as errors from 'restify-errors';

import { Customer } from '../../models';
import { successResponse } from '../../response';

/**
 * post /v1/customers
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 *
 **/

export async function handler(req: restify.Request, res: restify.Response, next: restify.Next) {
  try {
    const customers = await Customer.find({});
    return successResponse(res, customers, next);
  } catch (error) {
    return next(new errors.InvalidContentError(error));
  }
}
