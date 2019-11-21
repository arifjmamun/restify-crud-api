import 'reflect-metadata';
import { CustomerService } from './customer.service';
import { Pagination } from '../models/pagination.model';

describe('Customer Service', () => {
  let customerService: CustomerService;

  beforeEach(() => {
    customerService = new CustomerService();
  });

  it('should get all customer without pagination', async () => {
    const customers = await customerService.getAllCustomers({} as Pagination);
    expect(customers).toBeTruthy();
  });

  it('should test simple async method', async () => {
    const valid = await customerService.testPromise();
    expect(valid).toBe(true);
  });
});
