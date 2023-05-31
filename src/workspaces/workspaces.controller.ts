import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('api/workspaces')
export class WorkspacesController {
  // GET /workspaces
  // 내 워크스페이스 목록을 가져옴
  // return: IWorkspace[]
  @Get()
  getMyWorkspaces() {
    // getMyWorkspaces
  }

  // POST /workspaces
  // 워크스페이스를 생성함
  // body: { workspace: string(이름), url: string(주소) }
  // return: IWorkspace
  @Post()
  createWorkspace() {
    // createWorkspace
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
}
