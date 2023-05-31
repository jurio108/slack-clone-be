/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    type: UserDto,
  })
  @ApiOperation({
    summary: '사용자 정보 조회',
    description: '사용자 로그인 정보를 가져옴, 로그인되어있지 않으면 false',
  })
  @Get()
  getUsers(@Req() req) {
    return req.users;
  }

  // GET /workspaces/:url/users/:id
  // :url의 멤버인 특정 :id 사용자 정보를 가져옴
  // return: IUser

  // POST /users
  // 회원가입
  // body: { email: string(이메일), nickname: string(닉네임), password: string(비밀번호) }
  // return: 'ok'
  @ApiOkResponse({
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  postUsers(@Body() body: JoinRequestDto) {
    this.usersService.postUsers(body.email, body.nickname, body.password);
  }

  // POST /users/login
  // 로그인
  // body: { email: string(이메일), password: string(비밀번호) }
  // return: IUser
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn() {
    // logIn
  }

  // POST /users/logout
  // 로그아웃
  // return: 'ok'
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
