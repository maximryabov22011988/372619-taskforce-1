import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber } from '@project/libs/shared-types';
import {
  EmailSubscriberModel,
  EmailSubscriberModelProperties,
} from './email-subscriber.model';

@Injectable()
export class EmailSubscriberRepository {
  constructor(
    @InjectModel(EmailSubscriberModel.name)
    private readonly emailSubscriberModel: Model<EmailSubscriberModel>
  ) {}

  public async create(
    emailSubscriberData: EmailSubscriberModelProperties
  ): Promise<Subscriber> {
    const newEmailSubscriber = new this.emailSubscriberModel(
      emailSubscriberData
    );
    return newEmailSubscriber.save();
  }

  public async destroy(id: string): Promise<void> {
    this.emailSubscriberModel.deleteOne({ _id: id });
  }

  public async findById(id: string): Promise<Subscriber | null> {
    return this.emailSubscriberModel.findOne({ _id: id }).exec();
  }

  public async update(
    id: string,
    emailSubscriberData: EmailSubscriberModelProperties
  ): Promise<Subscriber> {
    return this.emailSubscriberModel
      .findByIdAndUpdate(id, { ...emailSubscriberData }, { new: true })
      .exec();
  }

  public async findByTitle(title: string): Promise<Subscriber | null> {
    return this.emailSubscriberModel.findOne({ title }).exec();
  }
}
