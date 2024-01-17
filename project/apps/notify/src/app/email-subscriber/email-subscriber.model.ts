import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Subscriber } from '@project/libs/shared-types';

export type EmailSubscriberModelProperties = Subscriber;

@Schema({
  collection: 'email-subscribers',
  timestamps: true,
})
export class EmailSubscriberModel extends Document implements Subscriber {
  @Prop()
  public userId: string;

  @Prop()
  public title: string;

  @Prop()
  public description: string;

  @Prop()
  public city: string;

  @Prop()
  public price: number;
}

export const EmailSubscriberSchema =
  SchemaFactory.createForClass(EmailSubscriberModel);
