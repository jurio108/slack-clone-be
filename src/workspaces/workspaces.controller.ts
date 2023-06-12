import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create.workspace.dto';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspaceService: WorkspacesService) {}

  /**
   * GET /workspaces
   * 내 워크스페이스 목록을 가져옴
   * @param user { id: string(ID) }
   * @returns workspace
   */
  @Get()
  getMyWorkspaces(@User() user: Users) {
    return this.workspaceService.findMyWorkspaces(user.id);
  }

  /**
   * POST /workspaces
   * 워크스페이스를 생성함
   * @param user { id: string(ID) }
   * @param body { name: string(이름), url: string(주소) }
   * @returns 생성된 workspace
   */
  @Post()
  async createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(body.name, body.url, user.id);
  }

  // GET /workspaces/:url/members
  // :url 내부의 멤버 목록을 가져옴
  // return: IUser[]
  @Get(':url/members')
  getAllMembersFromWorkspace() {
    // getAllMembersFromWorkspace
  }

  // POST /workspaces/:url/members
  // :url로 멤버 초대
  // body: { email: string(이메일) }
  // return: 'ok'
  @Post(':url/members')
  inviteMembersToWorkspace() {
    // inviteMembersToWorkspace
  }

  // DELETE /workspaces/:url/members/:id
  // :url에서 :id 멤버 제거(또는 탈퇴)
  // return 'ok'
  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {
    // kickMemberFromWorkspace
  }

  // @Get(':url/members/:id')
  // getMemberInfoInWorkspace() {
  //   // getMemberInfoInWorkspace
  // }

  // @Get(':url/members')
  // async getWorkspaceMembers(@Param('url') url: string) {
  //   return this.workspacesService.getWorkspaceMembers(url);
  // }

  // @Post(':url/members')
  // async createWorkspaceMembers(
  //   @Param('url') url: string,
  //   @Body('email') email,
  // ) {
  //   return this.workspacesService.createWorkspaceMembers(url, email);
  // }

  // @Get(':url/members/:id')
  // async getWorkspaceMember(
  //   @Param('url') url: string,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.workspacesService.getWorkspaceMember(url, id);
  // }

  // @Get(':url/users/:id')
  // async DEPRECATED_getWorkspaceUser(
  //   @Param('url') url: string,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.workspacesService.getWorkspaceMember(url, id);
  // }
}


// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post,
// } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { WorkspacesService } from './workspaces.service';
// import { User } from '../common/decorators/user.decorator';
// import { Users } from '../entities/Users';
// import { CreateWorkspaceDto } from './dto/create-workspace.dto';

// @ApiTags('WORKSPACE')
// @Controller('api/workspaces')
// export class WorkspacesController {
//   constructor(private workspacesService: WorkspacesService) {}

//   @Get()
//   async getMyWorkspaces(@User() user: Users) {
//     return this.workspacesService.findMyWorkspaces(user.id);
//   }

//   @Post()
//   async createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
//     return this.workspacesService.createWorkspace(
//       body.workspace,
//       body.url,
//       user.id,
//     );
//   }

//   @Get(':url/members')
//   async getWorkspaceMembers(@Param('url') url: string) {
//     return this.workspacesService.getWorkspaceMembers(url);
//   }

//   @Post(':url/members')
//   async createWorkspaceMembers(
//     @Param('url') url: string,
//     @Body('email') email,
//   ) {
//     return this.workspacesService.createWorkspaceMembers(url, email);
//   }

//   @Get(':url/members/:id')
//   async getWorkspaceMember(
//     @Param('url') url: string,
//     @Param('id', ParseIntPipe) id: number,
//   ) {
//     return this.workspacesService.getWorkspaceMember(url, id);
//   }

//   @Get(':url/users/:id')
//   async DEPRECATED_getWorkspaceUser(
//     @Param('url') url: string,
//     @Param('id', ParseIntPipe) id: number,
//   ) {
//     return this.workspacesService.getWorkspaceMember(url, id);
//   }
// }
