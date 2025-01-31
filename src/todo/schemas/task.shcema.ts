import { Prop, SchemaFactory, Schema as NSchema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Helpers } from 'src/utils/helpers/helpers';

export type TaskDocument = HydratedDocument<DbTask>;

@NSchema()
export class DbTask {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, default: false })
  value: boolean;

  @Prop({ required: true, unique: true })
  token?: string;
}

export const TaskSchema = SchemaFactory.createForClass(DbTask).plugin(
  Helpers.autopopulatePlugin,
);
