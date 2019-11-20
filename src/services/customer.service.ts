import { injectable } from 'inversify';

import { Customer } from '../schemas';
import { ICustomer, Pagination } from '../models';

@injectable()
export class CustomerService {
  public async getAllCustomers(pagination: Pagination): Promise<ICustomer[]> {
    let filterConditions = {};
    if (pagination.searchTerm) {
      filterConditions = {
        $or: [
          { name: { $regex: pagination.searchTerm, $options: 'i' } },
          { email: { $regex: pagination.searchTerm, $options: 'i' } }
          // { balance: { $regex: pagination.searchTerm, $options: 'i' } },
        ]
      };
    }
    const customers = await Customer.find(filterConditions, { name: 1, email: 1, balance: 1, updatedAt: 1 })
      .skip(pagination.pageSize * (pagination.page - 1))
      .limit(pagination.pageSize)
      .sort(pagination.sortOrder);
    return customers;
  }

  public async getCustomerById(customerId: string): Promise<ICustomer> {
    const customer = await Customer.findById({ _id: customerId });
    return customer;
  }

  public async addCustomer(customer: ICustomer): Promise<ICustomer> {
    const createdCustomer = await new Customer(customer).save();
    return createdCustomer;
  }

  public async updateCustomer(customer: ICustomer): Promise<ICustomer> {
    const updatedCustomer = await Customer
      .findByIdAndUpdate({ _id: customer._id }, { $set: customer }, { new: true })
      .exec();
    return updatedCustomer;
  }

  public async deleteCustomer(customerId: string): Promise<ICustomer> {
    const deletedCustomer = await Customer.findByIdAndDelete({ _id: customerId }).exec();
    return deletedCustomer;
  }
}
