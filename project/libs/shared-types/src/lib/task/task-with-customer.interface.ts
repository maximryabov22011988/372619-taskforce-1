import { Task } from './task.interface';
import { User } from '../user';

export type TaskWithCustomer = Omit<Task, 'customerId'> & {
  customer: Pick<User, 'id' | 'firstname' | 'lastname' | 'email'>;
};
