import { DateString } from '../shared';

export interface Comment {
  id?: string;
  text: string;
  taskId: string;
  authorId: string;
  createdAt: DateString;
}
