import { AvailableCity } from '../shared';
import { TaskStatus } from './task-status.enum';

export type Tag = string;

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  executionDate: string;
  imageUrl: string;
  address: string;
  tags: Tag[];
  city: AvailableCity;
  status: TaskStatus;
  customerId: string;
  createdAt: number;
  commentsCount?: number;
  responsesCount?: number;
}
