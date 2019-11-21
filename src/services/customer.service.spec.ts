import 'reflect-metadata';
import { expect } from 'chai';
import { CustomerService } from './customer.service';
import { Pagination } from '../models/pagination.model';

describe('Customer Service', () => {
  let customerService: CustomerService;

  beforeEach(() => {
    customerService = new CustomerService();
  });

  it('should get all customer without pagination', async () => {
    const customers = await customerService.getAllCustomers({} as Pagination);
    expect(customers).not.to.be.null;
  });

  it('should get all customer with pagination', async () => {
    const customers = await customerService.getAllCustomers(new Pagination({
      page: 1,
      pageSize: 10
    }));
    expect(customers).not.to.be.null;
  });

  it('should test simple async method', async () => {
    const valid = await customerService.testPromise();
    expect(valid).to.be.equal(true);
  });
});
