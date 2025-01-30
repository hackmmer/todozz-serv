import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DbUser, UserSchema } from './schemas/user.schema';
import { Session, SessionSchema } from './schemas/sessions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbUser.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
