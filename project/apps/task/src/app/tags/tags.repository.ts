import { Inject, Injectable } from '@nestjs/common';
import { TagModel, TagModelProperties } from '../../database/models/tag.model';
import { TasksTagsModel } from '../../database/models/tasks-tags.model';

@Injectable()
export class TagsRepository {
  constructor(
    @Inject(TagModel) private readonly tagModel: typeof TagModel,
    @Inject(TasksTagsModel)
    private readonly tasksTagsModel: typeof TasksTagsModel
  ) {}

  public async findByName(name: string): Promise<TagModel> {
    return this.tagModel.query().where({ name }).returning('*').first();
  }

  public async create(
    tagData: TagModelProperties,
    taskId: number
  ): Promise<TagModel> {
    let tagModel = await this.findByName(tagData.name);
    if (!tagModel) {
      tagModel = await this.tagModel.query().insert(tagData).returning('*');
    }

    await this.tasksTagsModel.query().insert({ tagId: tagModel.id, taskId });

    return tagModel;
  }
}
