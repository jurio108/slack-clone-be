import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create.workspace.dto';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  /**
   * GET /workspaces
   * 내 워크스페이스 목록을 가져옴
   *
   * @param user { id: string(ID) }
   * @returns IWorkspace[]
   */
  @ApiOperation({
    summary: '워크스페이스 목록 조회',
    description: '내 워크스페이스 목록을 가져옴',
  })
  @Get()
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  /**
   * POST /workspaces
   * 워크스페이스를 생성함
   *
   * @param user { id: string(ID) }
   * @param body { name: string(이름), url: string(주소) }
   * @returns IWorkspace
   */
  @ApiOperation({
    summary: '워크스페이스 생성',
    description: '워크스페이스 생성',
  })
  @Post()
  async createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(body.name, body.url, user.id);
  }

  /**
   * GET /workspaces/:url/members
   * :url 내부의 멤버 목록을 가져옴
   *
   * @param url string
   * @returns IUsers[]
   */
  @ApiOperation({
    summary: '워크스페이스 내부 멤버 조회',
    description: '워크스페이스 :url 내부의 멤버 목록을 가져옴',
  })
  @Get(':url/members')
  getAllMembersFromWorkspace(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  /**
   * POST /workspaces/:url/members
   * :url로 멤버 초대
   *
   * @param user string(ID)
   * @param email string
   * @returns
   */
  @ApiOperation({
    summary: '워크스페이스 멤버 생성',
    description: '워크스페이스 :url로 멤버 초대',
  })
  @Post(':url/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Body('email') email: string,
  ) {
    return this.workspacesService.createWorkspaceMembers(url, email);
  }

  @ApiOperation({
    summary: '워크스페이스 멤버 조회',
    description: '워크스페이스 개별 멤버 조회',
  })
  @Get(':url/members/:id')
  async getWorkspaceMember(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Users> {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
