import { Prop, SchemaFactory, Schema as NSchema } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { IUser } from 'src/users/entities/user.entity';
import { DbUser } from 'src/users/schemas/user.schema';
import { Helpers } from 'src/utils/helpers/helpers';
import { IWorkspace } from 'src/workspace/entities/workspace.entity';
import { DbWorkspace } from 'src/workspace/schemas/workspace.schema';

export type ShareDocument = HydratedDocument<Share>;

@NSchema()
export class Share {
  @Prop({ unique: true })
  token: string;

  @Prop({
    type: Schema.Types.ObjectId,
    ref: DbUser.name,
    autopopulate: true,
  })
  user: IUser;

  @Prop({
    type: Schema.Types.ObjectId,
    ref: DbWorkspace.name,
    autopopulate: true,
  })
  workspace: IWorkspace;
}

export const ShareSchema = SchemaFactory.createForClass(Share);
ShareSchema.plugin(Helpers.autopopulatePlugin);
