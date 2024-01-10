import {
  createUsersFixture,
  UsersFixture,
} from '@app/authentication/hexagon/__tests__/fixtures/users.fixture';
import {
  AuthFixture,
  createAuthFixture,
} from '@app/authentication/hexagon/__tests__/fixtures/auth.fixture';
import { userBuilder } from '@app/authentication/hexagon/__tests__/builders/user.builder';
import { InMemoryUsersRepository } from '@app/authentication/infra/gateways/repositories/in-memory-users.repository';

describe('Feature: Login', () => {
  let usersFixture: UsersFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository();
    usersFixture = createUsersFixture({ usersRepository });
    authFixture = createAuthFixture({ usersRepository });
  });

  test('User can login', async () => {
    const user = userBuilder()
      .withId('c5b235db-d6d1-4191-8fa7-a33cf301e20e')
      .withEmail('john.doe@gmail.com')
      .withPassword('hashed-password')
      .withCompanyId('ec8142a6-5de5-45d5-95a5-d0e70b683481')
      .build();

    authFixture.givenPasswordCompareResult(
      { password: 'password', hash: 'hashed-password' },
      true,
    );

    usersFixture.givenUsers([user]);

    await authFixture.whenLogin({
      email: 'john.doe@gmail.com',
      password: 'password',
    });

    authFixture.thenUserIsLoggedInAs({
      id: 'c5b235db-d6d1-4191-8fa7-a33cf301e20e',
      companyId: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
    });
  });

  test('User cannot login with wrong password', async () => {
    const user = userBuilder()
      .withId('c5b235db-d6d1-4191-8fa7-a33cf301e20e')
      .withEmail('john.doe@gmail.com')
      .withPassword('hashed-password')
      .build();

    authFixture.givenPasswordCompareResult(
      { password: 'wrong-password', hash: 'hashed-password' },
      false,
    );

    usersFixture.givenUsers([user]);

    await authFixture.whenLogin({
      email: 'john.doe@gmail.com',
      password: 'wrong-password',
    });

    authFixture.thenUserIsNotLoggedIn();
  });

  test('User not found for given email', async () => {
    await authFixture.whenLogin({
      email: 'john.doe@gmail.com',
      password: 'password',
    });
    authFixture.thenUserIsNotLoggedIn();
  });
});
