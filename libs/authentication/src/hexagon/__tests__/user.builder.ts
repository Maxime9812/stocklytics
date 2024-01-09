import { User, UserSnapshot } from '@app/authentication/hexagon/models/user';

export const userBuilder = (
  snapshot: UserSnapshot = {
    id: 'ec8142a6-5de5-45d5-95a5-d0e70b683481',
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
