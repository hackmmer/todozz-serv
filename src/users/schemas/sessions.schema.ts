import { Prop, SchemaFactory, Schema as NSchema } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';
import { IUser } from '../entities/user.entity';
import { DbUser } from './user.schema';
import { Helpers } from 'src/utils/helpers/helpers';

export type SessionDocument = HydratedDocument<Session>;

@NSchema()
export class Session {
  @Prop()
  key: string;

  @Prop({
    type: Schema.Types.ObjectId,
    ref: DbUser.name,
    autopopulate: true,
  })
  user: IUser;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.plugin(Helpers.autopopulatePlugin);
