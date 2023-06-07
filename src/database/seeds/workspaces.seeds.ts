import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Workspaces } from '../../entities/Workspaces';

export default class WorkspaceSeeds implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Workspaces);
    await repository.insert([{ id: 1, name: 'Sleact', url: 'sleact' }]);
  }
}
