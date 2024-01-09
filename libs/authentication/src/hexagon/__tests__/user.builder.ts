import { User, UserSnapshot } from '@app/authentication/hexagon/models/user';

export const userBuilder = (
  snapshot: UserSnapshot = {
    id: '1f86a8562-8d11-429b-9dd0-0dbb0e69bc7a',
    email: 'john.doe@gmail.com',
    password: 'encrypted-password',
    salt: 'salt',
    createdAt: new Date('2024-01-01'),
  },
) => {
  return {
    withId: (id: string) => userBuilder({ ...snapshot, id }),
    withEmail: (email: string) => userBuilder({ ...snapshot, email }),
    withPassword: (password: string) => userBuilder({ ...snapshot, password }),
    createdAt: (createdAt: Date) => userBuilder({ ...snapshot, createdAt }),
    whitSalt: (salt: string) => userBuilder({ ...snapshot, salt }),
    build: () => User.fromSnapshot(snapshot),
  };
};
