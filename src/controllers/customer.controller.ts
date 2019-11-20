import { Request } from 'restify';
import { NotFoundError, BadRequestError } from 'restify-errors';
import { injectable, inject } from 'inversify';
import { Controller, Get, Post, interfaces } from 'inversify-restify-utils';

import { Customer } from '../schemas';
import { ICustomer, Pagination } from '../models';
import { CustomerService } from '../services';
import { Services } from '../constants/types';
import { addCustomerValidation } from '../validations';

@Controller('/api/customer')
@injectable()
export class CustomerController implements interfaces.Controller {
  constructor(@inject(Services.CustomerService) private customerService: CustomerService) {}

  /**
   * Get All customer by pagination
   * @param req
   */
  @Get('/list')
  public async getAllCustomer(req: Request) {
    try {
      const params = new Pagination(req.query);
      const customers = await this.customerService.getAllCustomers(params);
      return customers;
    } catch (error) {
      return new NotFoundError(error);
    }
  }

  @Post('/add')
  public async addCustomer(req: Request) {
    try {
      const { error } = addCustomerValidation(req.body);
      if (error) {
        return new BadRequestError(error);
      }
      const customer = req.body as ICustomer;
      const createdCustomer = await new Customer(customer).save();
      return createdCustomer;
    } catch (error) {
      return new BadRequestError(error);
    }
  }
}
