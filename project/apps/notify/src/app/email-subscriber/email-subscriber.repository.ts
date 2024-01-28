import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ): Promise<EmailSubscriberModel> {
    const newEmailSubscriber = new this.emailSubscriberModel(
      emailSubscriberData
    );
    return newEmailSubscriber.save();
  }

  public async destroy(id: string): Promise<void> {
    this.emailSubscriberModel.deleteOne({ _id: id });
  }

  public async findLatest(): Promise<EmailSubscriberModel | null> {
    return this.emailSubscriberModel.findOne().sort({ createdAt: -1 }).exec();
  }
}
