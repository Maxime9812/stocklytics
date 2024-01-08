import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../../test/docker-manager';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { FolderPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/folder.pm';
import { folderBuilder } from '@app/inventory/write/hexagon/__tests__/builders/folder.builder';
import { KnexFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-folders.repository';
import { Folder } from '@app/inventory/write/hexagon/models/folder';

describe('KnexFoldersRepository', () => {
  let sqlConnection: Knex;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
  });

  describe('save', () => {
    it('should save a new folder', async () => {
      const folder = folderBuilder()
        .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .withName('Electronics')
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .withParentId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .build();
      await new KnexFoldersRepository(sqlConnection).save(folder);
      expect(await findExistingFolders()).toEqual<FolderPm[]>([
        {
          id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
          name: 'Electronics',
          companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
          parentId: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ]);
    });

    it('should update folder instead of create a new one if folder already exists', async () => {
      const initialFolderBuilder = folderBuilder()
        .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .withName('Electronics')
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .withParentId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'));
      const initialFolder = initialFolderBuilder.build();
      await insertFolder(initialFolder);

      const folder = initialFolderBuilder.withName('Foods').build();
      await new KnexFoldersRepository(sqlConnection).save(folder);

      expect(await findExistingFolders()).toEqual<FolderPm[]>([
        {
          id: '349b8b68-109a-486f-bdc2-daedc31a6beb',
          name: 'Foods',
          companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
          parentId: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ]);
    });
  });

  describe('getById', () => {
    it('should return undefined if folder does not exist', async () => {
      const folder = await new KnexFoldersRepository(sqlConnection).getById(
        '349b8b68-109a-486f-bdc2-daedc31a6beb',
      );
      expect(folder).toBeUndefined();
    });

    it('should return folder if it exists', async () => {
      const folder = folderBuilder()
        .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .withName('Electronics')
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .withParentId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .build();
      await insertFolder(folder);

      const folderFromDb = await new KnexFoldersRepository(
        sqlConnection,
      ).getById('349b8b68-109a-486f-bdc2-daedc31a6beb');
      expect(folderFromDb?.snapshot).toEqual(folder.snapshot);
    });
  });

  describe('folderWIthNameInParentFolderExists', () => {
    it('should return false if folder does not exist', async () => {
      const folderExists = await new KnexFoldersRepository(
        sqlConnection,
      ).folderWithNameInParentFolderExists({
        name: 'Electronics',
        companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
        parentId: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
      });
      expect(folderExists).toBe(false);
    });

    it('should return true if folder exists', async () => {
      const folder = folderBuilder()
        .withId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .withName('Electronics')
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .withParentId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .build();
      await insertFolder(folder);

      const folderExists = await new KnexFoldersRepository(
        sqlConnection,
      ).folderWithNameInParentFolderExists({
        name: 'Electronics',
        companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
        parentId: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
      });
      expect(folderExists).toBe(true);
    });
  });

  const insertFolder = async (folder: Folder) => {
    const { id, name, companyId, parentId, createdAt } = folder.snapshot;
    await sqlConnection('folders').insert({
      id,
      name,
      companyId,
      parentId,
      createdAt,
    });
  };
  const findExistingFolders = async () => {
    return sqlConnection('folders').select<FolderPm[]>('*');
  };
});
