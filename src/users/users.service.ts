import {
  // HttpException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async join(email: string, nickname: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      // throw new HttpException(`${email} 이미 사용중인 이메일입니다.`);
      // nestjs에서 제공하는 ConflictException
      throw new ConflictException(`${email} 이미 사용중인 이메일입니다.`);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
