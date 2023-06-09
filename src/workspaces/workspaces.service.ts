import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    // @InjectRepository(Channels)
    // private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  private logger = new Logger('WorkspacesService');

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner(); // transaction 생성용 queryrunner
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const workspace = new Workspaces();
      workspace.name = name;
      workspace.url = url;
      workspace.OwnerId = myId;
      // const returned = await this.workspacesRepository.save(workspace);
      const returned = await queryRunner.manager
        .getRepository(Workspaces)
        .save(workspace);

      const workspaceMember = new WorkspaceMembers();
      workspaceMember.UserId = myId;
      workspaceMember.WorkspaceId = returned.id;
      // await this.workspaceMembersRepository.save(workspaceMember);
      await queryRunner.manager
        .getRepository(WorkspaceMembers)
        .save(workspaceMember);

      const channel = new Channels();
      channel.name = '일반';
      channel.WorkspaceId = returned.id;
      // const channelReturned = await this.channelsRepository.save(channel);
      const channelReturned = await queryRunner.manager
        .getRepository(Channels)
        .save(channel);

      const channelMember = new ChannelMembers();
      channelMember.UserId = myId;
      channelMember.ChannelId = channelReturned.id;
      // await this.channelMembersRepository.save(channelMember);
      await queryRunner.manager
        .getRepository(ChannelMembers)
        .save(channelMember);

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany();
    // ${} 으로 직접 변수를 넣으면 인젝션에 취약해짐 >>> 파라미터로 넣으면 typeorm에서 위험문자를 바꿔줌
    // .innerJoin('members.Workspace', 'workspace', `workspace.url = ${url}`)

    /**
     * getMany, getRawMany 차이점 : return 값에 주목
     *
     * return : ID, EMAIL, Workspace.NAME
     *
     * getRawMany
     *  {
     *    ID: '',
     *    EMAIL: '',
     *    'Workspace.NAME': '',
     *  }
     * getMany
     * ID, EMAIL, Workspace.NAME
     *  {
     *    ID: '',
     *    EMAIL: '',
     *    Workspace: {
     *      NAME: '',
     *    }
     *  }
     */
  }

  async createWorkspaceMembers(url: string, email: string) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;

    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .getOne();
  }
}
