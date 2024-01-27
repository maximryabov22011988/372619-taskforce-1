import { Injectable, BadRequestException } from '@nestjs/common';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  public checkIsValidTag(tag: string) {
    const START_WITH_LETTER = /^[A-Za-zА-Яа-яЁё]/;
    if (tag.includes(' ') || !START_WITH_LETTER.test(tag)) {
      throw new BadRequestException(`Invalid tag "${tag}"`);
    }
  }

  public async createTags(tags: string[], taskId: number): Promise<void> {
    if (tags.length) {
      const loweredTags = tags.map((tag) => tag.toLowerCase());
      const uniqTags = new Set([...loweredTags]);

      for (const tag of uniqTags) {
        this.checkIsValidTag(tag);
        await this.tagsRepository.create({ name: tag }, taskId);
      }
    }
  }
}
