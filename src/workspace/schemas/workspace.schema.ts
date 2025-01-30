import { Prop, SchemaFactory, Schema as NSchema } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { ITodo } from 'src/todo/entities/todo.entity';
import { Helpers } from 'src/utils/helpers/helpers';
import { IWorkspace } from 'src/workspace/entities/workspace.entity';

export type WorkspaceDocument = HydratedDocument<DbWorkspace>;

@NSchema()
export class DbWorkspace implements IWorkspace {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  title: string;

  @Prop([
    {
      type: Schema.Types.ObjectId,
      ref: 'Todo',
      required: true,
      default: [],
      autopopulate: true,
    },
  ])
  todos: ITodo[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(DbWorkspace);
WorkspaceSchema.plugin(Helpers.autopopulatePlugin);
