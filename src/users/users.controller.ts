/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users
  // 내 로그인 정보를 가져옴, 로그인되어있지 않으면 false
  // return: IUser | false
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
  @Post()
  postUsers(@Body() body: JoinRequestDto) {
    this.usersService.postUsers(body.email, body.nickname, body.password);
  }

  // POST /users/login
  // 로그인
  // body: { email: string(이메일), password: string(비밀번호) }
  // return: IUser
  @Post('login')
  logIn() {
    // logIn
  }

  // POST /users/logout
  // 로그아웃
  // return: 'ok'
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
