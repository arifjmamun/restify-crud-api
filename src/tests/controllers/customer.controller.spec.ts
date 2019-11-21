import 'reflect-metadata';
import { CustomerController } from '../../controllers';
import { CustomerService } from '../../services';

describe('Customer Controller', () => {
  let controller: CustomerController;

  beforeEach(() => {
    controller = new CustomerController(new CustomerService());
  });

  it('should instantiate Customer Controller', () => {
    expect(controller).toBeTruthy();
  });
});
