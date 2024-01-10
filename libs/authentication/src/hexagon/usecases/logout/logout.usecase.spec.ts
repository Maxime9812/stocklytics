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
    authFixture.givenUserIsLoggedInAs({
      id: 'c5b235db-d6d1-4191-8fa7-a33cf301e20e',
      companyId: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
    });

    await authFixture.whenLogout();

    authFixture.thenUserIsNotLoggedIn();
  });
});
