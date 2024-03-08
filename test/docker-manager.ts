import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';
import knex, { Knex } from 'knex';
import * as path from 'path';
import { knexConfig } from '../libs/shared/src/database';

const composeFilePath = path.resolve(process.cwd(), 'test');
const composeFile = 'docker-compose-test.yaml';

export let dockerInstance: StartedDockerComposeEnvironment | null = null;

export const startDockerPostgresql = async (): Promise<void> => {
  let sqlConnection: Knex;
  try {
    console.log('start DB migration');
    dockerInstance = await new DockerComposeEnvironment(
      composeFilePath,
      composeFile,
    ).up();
    sqlConnection = knex(knexConfig.test);
    await sqlConnection.migrate.latest();
    console.log('end DB migration');
  } catch (e) {
    console.log(e);
    throw new Error('Fail to start the database' + e);
  } finally {
    await sqlConnection.destroy();
  }
};

const tables = [
  'tags',
  'item_images',
  'items',
  'folders',
  'items_tags',
  'users',
  'companies',
];

export const resetDB = async (sqlConnection: Knex) => {
  return Promise.all(
    tables.map((table) =>
      sqlConnection.raw('truncate table ' + table + ' cascade'),
    ),
  );
};
