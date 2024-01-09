import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { User } from '@app/authentication/hexagon/models/user';
import { UserPm } from '@app/authentication/infra/gateways/repositories/knex/persistent-models/user.pm';
import { userBuilder } from '@app/authentication/hexagon/__tests__/user.builder';
import { KnexUsersRepository } from '@app/authentication/infra/gateways/repositories/knex/knex-users.repository';

describe('KnexUsersRepository', () => {
  let sqlConnection: Knex;
  let usersRepository: KnexUsersRepository;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    usersRepository = new KnexUsersRepository(sqlConnection);
  });

  describe('save', () => {
    test('User is saved', async () => {
      const user = userBuilder()
        .withId('ec8142a6-5de5-45d5-95a5-d0e70b683481')
        .withEmail('john.doe@gmail.com')
        .withPassword('encrypted-password')
        .createdAt(new Date('2024-01-01'))
        .whitSalt('salt')
        .build();

      await usersRepository.save(user);

      expect(await findExistingUsers()).toEqual<UserPm[]>([
        {
          id: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
          email: 'john.doe@gmail.com',
          password: 'encrypted-password',
          salt: 'salt',
          createdAt: new Date('2024-01-01'),
        },
      ]);
    });

    test('User is updated if already exists', async () => {
      const initialUserBuilder = userBuilder()
        .withId('ec8142a6-5de5-45d5-95a5-d0e70b683481')
        .withEmail('john.doe@gmail.com')
        .withPassword('encrypted-password')
        .createdAt(new Date('2024-01-01'))
        .whitSalt('salt');
      await insertUser(initialUserBuilder.build());

      const user = initialUserBuilder
        .withEmail('changed-email@gmail.com')
        .build();

      await usersRepository.save(user);

      expect(await findExistingUsers()).toEqual<UserPm[]>([
        {
          id: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
          email: 'changed-email@gmail.com',
          password: 'encrypted-password',
          salt: 'salt',
          createdAt: new Date('2024-01-01'),
        },
      ]);
    });
  });

  describe('getByEmail', () => {
    test('user is undefined if not found', async () => {
      const user = await usersRepository.getByEmail('not-exist@gmail.com');
      expect(user).toBeUndefined();
    });
    test('user is returned if found', async () => {
      const userInDb = userBuilder().withEmail('john.doe@gmail.com').build();
      await insertUser(userInDb);

      const user = await usersRepository.getByEmail('john.doe@gmail.com');

      expect(user?.snapshot).toEqual(userInDb.snapshot);
    });
  });

  const insertUser = async (user: User) => {
    const { id, email, password, salt, createdAt } = user.snapshot;
    await sqlConnection('users').insert({
      id,
      email,
      password,
      salt,
      createdAt,
    });
  };
  const findExistingUsers = async () => {
    return sqlConnection('users').select<UserPm[]>('*');
  };
});
