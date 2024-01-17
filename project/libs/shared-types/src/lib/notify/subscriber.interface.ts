import { Uuid } from '../shared';

export interface Subscriber {
  userId: Uuid;
  title: string;
  description: string;
  city: string;
  price: number;
}
