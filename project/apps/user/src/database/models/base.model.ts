import { Model } from 'objection';

export class BaseModel<T = number> extends Model {
  public readonly id: T;
}
