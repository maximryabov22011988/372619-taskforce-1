import { AvailableCity } from '../shared';
import { TaskStatus } from './task-status.enum';

export type Category = string;
export type Tag = string;

export interface Task {
  id?: number;
  title: string;
  description: string;
  category: Category;
  city: AvailableCity;
  price: number;
  executionDate: string;
  imageUrl: string;
  address: string;
  tags: Tag[];
  status: TaskStatus;
  contractorId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}
