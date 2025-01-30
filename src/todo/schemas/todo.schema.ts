import { Prop, SchemaFactory, Schema as NSchema } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { ITask } from '../entities/todo.entity';
import { Helpers } from 'src/utils/helpers/helpers';

export type TodoDocument = HydratedDocument<DbTodo>;

@NSchema()
export class DbTodo {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  token?: string;

  @Prop([
    {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      default: [],
      autopopulate: true,
    },
  ])
  checkers: ITask[];
}

export const TodoSchema = SchemaFactory.createForClass(DbTodo);
TodoSchema.plugin(Helpers.autopopulatePlugin);
