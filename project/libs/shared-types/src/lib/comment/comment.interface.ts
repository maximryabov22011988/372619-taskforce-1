import { Uuid } from '../shared';

export interface Comment {
  id?: number;
  text: string;
  taskId: number;
  authorId: Uuid;
}
