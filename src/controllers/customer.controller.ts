import { Request } from 'restify';
import { NotFoundError, BadRequestError } from 'restify-errors';
import { injectable, inject } from 'inversify';
import { Controller, Get, Post, interfaces, Put } from 'inversify-restify-utils';

import { ICustomer, Pagination } from '../models';
import { CustomerService } from '../services';
import { Services } from '../constants/types';
import { addCustomerValidation, updateCustomerValidation } from '../validations';

@Controller('/api/customer')
@injectable()
export class CustomerController implements interfaces.Controller {
  constructor(
    @inject(Services.CustomerService) private customerService: CustomerService
  ) { }

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

  /**
   * Add customer
   * @param req
   * @description the *req.body* object need to have name, email, balance
   */
  @Post('/add')
  public async addCustomer(req: Request) {
    try {
      const { error } = addCustomerValidation(req.body);
      if (error) {
        return new BadRequestError(error);
      }
      const customer = req.body as ICustomer;
      const createdCustomer = await this.customerService.addCustomer(customer);;
      return createdCustomer;
    } catch (error) {
      return new BadRequestError(error);
    }
  }

  /**
   * Update customer By Id
   * @param req
   * @description the *req.body* object need to have any of these name, email, balance
   */
  @Put('/update/:id')
  public async updateCustomer(req: Request) {
    try {
      const { error } = updateCustomerValidation(req.body);
      if (error) {
        return new BadRequestError(error);
      }
      const customer = req.body as ICustomer;
      const updatedCustomer = await this.customerService.updateCustomer(customer);
      return updatedCustomer;
    } catch (error) {
      return new BadRequestError(error);
    }
  }
}
