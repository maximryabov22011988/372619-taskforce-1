import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NewTasksNotification } from '@project/libs/shared-types';

export type EmailSubscriberModelProperties = NewTasksNotification;

@Schema({
  collection: 'email-subscribers',
  timestamps: true,
})
export class EmailSubscriberModel
  extends Document
  implements NewTasksNotification
{
  public readonly createdAt: Date;

  @Prop()
  public emails: string[];
}

export const EmailSubscriberSchema =
  SchemaFactory.createForClass(EmailSubscriberModel);
