import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DbWorkspace, WorkspaceSchema } from './schemas/workspace.schema';
import { UsersModule } from 'src/users/users.module';
import { TodoModule } from 'src/todo/todo.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbWorkspace.name, schema: WorkspaceSchema },
    ]),
    UsersModule,
    forwardRef(() => TodoModule),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
