import {
  // HttpException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    // @InjectRepository(WorkspaceMembers)
    // private workspaceMembersRepository: Repository<WorkspaceMembers>,
    // @InjectRepository(ChannelMembers)
    // private channelMembersRepository: Repository<ChannelMembers>,
    private dataSource: DataSource,
  ) {}

  private logger = new Logger('UsersService');

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner(); // transaction 생성용 queryrunner
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      // throw new HttpException(`${email} 이미 사용중인 이메일입니다.`);
      // nestjs에서 제공하는 ConflictException
      throw new ConflictException(`${email} 이미 사용중인 이메일입니다.`);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // const users = await this.usersRepository.save({
      const users = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });

      // 기본 workspace 사용자로 등록
      // await this.workspaceMembersRepository.save({
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: users.id,
        WorkspaceId: 1,
      });

      // 기본 channel 사용자로 등록
      // await this.channelMembersRepository.save({
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: users.id,
        ChannelId: 1,
      });

      // throw new Error('에러 롤백 테스트');

      await queryRunner.commitTransaction();
      return users;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
