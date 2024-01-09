import {
  UsersFixture,
  createUsersFixture,
} from '@app/authentication/hexagon/__tests__/users.fixture';
import { userBuilder } from '@app/authentication/hexagon/__tests__/user.builder';
import {
  AuthFixture,
  createAuthFixture,
} from '@app/authentication/hexagon/__tests__/auth.fixture';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';

describe('Feature: Register User', () => {
  let usersFixture: UsersFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const authGateway = new InMemoryAuthGateway();
    usersFixture = createUsersFixture({ authGateway });
    authFixture = createAuthFixture({ authGateway });
  });

  test('User is registered', async () => {
    usersFixture.givenNowIs(new Date('2024-01-01'));
    usersFixture.givenHashedPassword('password', 'encrypted-password');
    usersFixture.givenUuid('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a');

    await usersFixture.whenRegisterUser({
      email: 'john.doe@gmail.com',
      password: 'password',
    });

    usersFixture.thenUsersShouldBe([
      userBuilder()
        .withId('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a')
        .withEmail('john.doe@gmail.com')
        .withPassword('encrypted-password')
        .createdAt(new Date('2024-01-01'))
        .build(),
    ]);
  });

  describe('Scenario: Email is already used', () => {
    test('User is not registered', async () => {
      const initialUser = userBuilder()
        .withEmail('used-email@gmail.com')
        .build();
      usersFixture.givenUsers([initialUser]);

      await usersFixture.whenRegisterUser({
        email: 'used-email@gmail.com',
        password: 'password',
      });

      usersFixture.thenUsersShouldBe([initialUser]);
    });
  });

  describe('Scenario: User is registered', () => {
    test('User is logged in', async () => {
      usersFixture.givenNowIs(new Date('2024-01-01'));
      usersFixture.givenHashedPassword('password', 'encrypted-password');
      usersFixture.givenUuid('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a');

      await usersFixture.whenRegisterUser({
        email: 'used-email@gmail.com',
        password: 'password',
      });

      authFixture.thenUserIsLoggedInAs('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a');
    });
  });
});
