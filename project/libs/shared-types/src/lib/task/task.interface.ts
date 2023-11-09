import { AvailableCity, DateString } from '../shared';
import { TaskStatus } from './task-status.enum';

export type Category = string;
export type Tag = string;

export interface Task {
  id?: string;
  title: string;
  description: string;
  category: Category;
  city: AvailableCity;
  price: number;
  executionDate: DateString;
  image: string;
  address: string;
  tags: Tag[];
  status: TaskStatus;
  contractorId: string;
  customerId: string;
  createdAt: DateString;
}
