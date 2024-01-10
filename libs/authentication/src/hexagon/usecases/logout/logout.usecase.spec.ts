import {
  AuthFixture,
  createAuthFixture,
} from '@app/authentication/hexagon/__tests__/fixtures/auth.fixture';

describe('Feature: logout', () => {
  let authFixture: AuthFixture;

  beforeEach(() => {
    authFixture = createAuthFixture();
  });

  test('User is logout', async () => {
    authFixture.givenUserIsLoggedInAs('c5b235db-d6d1-4191-8fa7-a33cf301e20e');

    await authFixture.whenLogout();

    authFixture.thenUserIsNotLoggedIn();
  });
});
