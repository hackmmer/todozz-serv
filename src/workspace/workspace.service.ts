import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './entities/workspace.entity';
import { merge } from 'lodash';

@Injectable()
export class WorkspaceService {

  workspaces: Workspace[] = [];

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaces.push(new Workspace(createWorkspaceDto))
  }

  findAll() {
    return this.workspaces;
  }

  findOne(id: string) {
    return this.workspaces.find(e => e._id === id);
  }

  update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    const i = this.workspaces.findIndex(e => e._id === id)
    merge(this.workspaces[i], updateWorkspaceDto)
    return this.workspaces[i];
  }

  remove(id: string) {
    const i = this.workspaces.findIndex(e => e._id === id)
    const u = this.workspaces.slice(i, i);
    return u;
  }
}
