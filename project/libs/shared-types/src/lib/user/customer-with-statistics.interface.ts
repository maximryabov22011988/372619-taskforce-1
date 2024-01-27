import { Customer } from './customer.interface';

export type CustomerWithStatistics = Omit<Customer, 'cityId'> & {
  city: string;
  publishedTaskCount: number;
  newTaskCount: number;
};
