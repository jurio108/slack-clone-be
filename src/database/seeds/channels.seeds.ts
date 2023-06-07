import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Channels } from '../../entities/Channels';

export default class ChannelsSeeds implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Channels);
    await repository.insert([
      { id: 1, name: '일반', WorkspaceId: 1, private: false },
    ]);
  }
}
