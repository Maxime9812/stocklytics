import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../test/docker-manager';
import { KnexGetCurrentUserQuery } from '@app/authentication/infra/queries/knex-get-current-user.query';
import { UserPm } from '@app/authentication/infra/gateways/repositories/knex/persistent-models/user.pm';

describe('KnexGetCurrentUserQuery', () => {
  let sqlConnection: Knex;
  let getCurrentUserQuery: KnexGetCurrentUserQuery;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    getCurrentUserQuery = new KnexGetCurrentUserQuery(sqlConnection);
  });

  test('return current user when exist', async () => {
    await sqlConnection<UserPm>('users').insert({
      id: 'ec8142a6-5de5-45d5-95a5-d0e70b683482',
      email: 'john.doe@gmail.com',
      companyId: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
      password: '123456',
      createdAt: new Date('2024-01-01'),
    });
    const user = await getCurrentUserQuery.execute(
      'ec8142a6-5de5-45d5-95a5-d0e70b683482',
    );
    expect(user).toEqual({
      id: 'ec8142a6-5de5-45d5-95a5-d0e70b683482',
      email: 'john.doe@gmail.com',
    });
  });
});
