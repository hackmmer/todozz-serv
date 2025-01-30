import { Prop, SchemaFactory, Schema as NSchema } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { IWorkspace } from 'src/workspace/entities/workspace.entity';
import { IUser } from '../entities/user.entity';
import { DbWorkspace } from 'src/workspace/schemas/workspace.schema';
import autopopulate from 'mongoose-autopopulate';
import { Helpers } from 'src/utils/helpers/helpers';

export type UserDocument = HydratedDocument<DbUser>;

@NSchema()
export class DbUser implements IUser {
  @Prop({ default: 'user' })
  profile_image?: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop([
    {
      type: String,
      default: [],
    },
  ])
  sessions: string[];

  @Prop([
    {
      type: Schema.Types.ObjectId,
      ref: DbWorkspace.name,
      default: [],
      autopopulate: true,
    },
  ])
  workspaces: IWorkspace[];
}

export const UserSchema = SchemaFactory.createForClass(DbUser);
UserSchema.plugin(Helpers.autopopulatePlugin);
