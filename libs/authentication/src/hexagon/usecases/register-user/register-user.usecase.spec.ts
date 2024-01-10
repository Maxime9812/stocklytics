import {
  UsersFixture,
  createUsersFixture,
} from '@app/authentication/hexagon/__tests__/fixtures/users.fixture';
import { userBuilder } from '@app/authentication/hexagon/__tests__/builders/user.builder';
import {
  AuthFixture,
  createAuthFixture,
} from '@app/authentication/hexagon/__tests__/fixtures/auth.fixture';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import {
  CompaniesFixture,
  createCompaniesFixture,
} from '@app/authentication/hexagon/__tests__/fixtures/companies.fixture';
import { InMemoryCompaniesRepository } from '@app/authentication/infra/gateways/repositories/in-memory-companies.repository';
import { companyBuilder } from '@app/authentication/hexagon/__tests__/builders/company.builder';
import { DroppingTransactionPerformer } from '@app/shared/transaction-performing/dropping-transaction-performer';

describe('Feature: Register User', () => {
  let usersFixture: UsersFixture;
  let authFixture: AuthFixture;
  let companiesFixture: CompaniesFixture;

  beforeEach(() => {
    const authGateway = new InMemoryAuthGateway();
    const companiesRepository = new InMemoryCompaniesRepository();
    usersFixture = createUsersFixture({ authGateway, companiesRepository });
    authFixture = createAuthFixture({ authGateway });
    companiesFixture = createCompaniesFixture({ companiesRepository });
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
        .withCompanyId('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a')
        .build(),
    ]);
  });

  test('Company is created for the user', async () => {
    usersFixture.givenNowIs(new Date('2024-01-01'));
    usersFixture.givenHashedPassword('password', 'encrypted-password');
    usersFixture.givenUuid('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a');

    await usersFixture.whenRegisterUser({
      email: 'john.doe@gmail.com',
      password: 'password',
    });

    companiesFixture.thenCompaniesShouldBe([
      companyBuilder()
        .withId('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a')
        .withName('')
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

      authFixture.thenUserIsLoggedInAs({
        id: '1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a',
        companyId: '1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a',
      });
    });
  });

  it('Should make transactional the process of registering a user', async () => {
    usersFixture.givenNowIs(new Date('2024-01-01'));
    usersFixture.givenHashedPassword('password', 'encrypted-password');
    usersFixture.givenUuid('1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a');
    usersFixture.givenTransactionPerformer(new DroppingTransactionPerformer());

    await usersFixture.whenRegisterUser({
      email: 'john.doe@gmail.com',
      password: 'password',
    });

    usersFixture.thenUsersShouldBe([]);
  });
});
