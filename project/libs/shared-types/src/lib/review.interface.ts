import { Uuid } from './shared';

export interface Review {
  id?: number;
  text: string;
  taskId: number;
  authorId: Uuid;
  rating: number;
}
