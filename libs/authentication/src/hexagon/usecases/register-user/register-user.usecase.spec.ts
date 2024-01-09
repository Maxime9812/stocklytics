import {
  UsersFixture,
  createUsersFixture,
} from '@app/authentication/hexagon/__tests__/users.fixture';
import { userBuilder } from '@app/authentication/hexagon/__tests__/user.builder';

describe('Feature: Register User', () => {
  let authFixture: UsersFixture;

  beforeEach(() => {
    authFixture = createUsersFixture();
  });

  test('User is registered', async () => {
    authFixture.givenNowIs(new Date('2024-01-01'));
    authFixture.givenHashedPassword('password', 'encrypted-password');
    authFixture.givenUuid('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a');

    await authFixture.whenRegisterUser({
      email: 'john.doe@gmail.com',
      password: 'password',
    });

    authFixture.thenUsersShouldBe([
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
      authFixture.givenUsers([initialUser]);

      await authFixture.whenRegisterUser({
        email: 'used-email@gmail.com',
        password: 'password',
      });

      authFixture.thenUsersShouldBe([initialUser]);
    });
  });
});
