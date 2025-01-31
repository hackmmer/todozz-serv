import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DbWorkspace, WorkspaceSchema } from './schemas/workspace.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbWorkspace.name, schema: WorkspaceSchema },
    ]),
    UsersModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
