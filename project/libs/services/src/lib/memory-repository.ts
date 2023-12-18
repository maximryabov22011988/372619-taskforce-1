import { v4 as makeUuid } from 'uuid';
import { CRUDRepository } from '@project/libs/utils-types';

export class MemoryRepository<E, R> implements CRUDRepository<E, string, R> {
  protected repository: { [key: string]: R } = {};

  public async findAll(): Promise<R[]> {
    return Object.values(this.repository);
  }

  public async findById(id: string): Promise<R | null> {
    if (this.repository[id]) {
      return { ...this.repository[id] };
    }

    return null;
  }

  public async create(item: E): Promise<R> {
    const id = makeUuid();
    const entry = {
      ...item,
      id,
    } as R;

    this.repository[id] = entry;

    return entry;
  }

  public async delete(id: string): Promise<void> {
    delete this.repository[id];
  }

  public async update(id: string, item: E): Promise<R> {
    this.repository[id] = {
      ...this.repository[id],
      ...item,
    };

    return this.findById(id);
  }
}
