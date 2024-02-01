import { User } from '@app/authentication/hexagon/models/user';

export class Company {
  private constructor(private props: CompanyConstructorProps) {}

  get id() {
    return this.props.id;
  }

  get snapshot(): CompanySnapshot {
    return {
      id: this.props.id,
      name: this.props.name,
      createdAt: this.props.createdAt,
    };
  }

  static create({
    id,
    currentDate,
    rootUser,
  }: {
    id: string;
    currentDate: Date;
    rootUser: { id: string; email: string; password: string; fullName: string };
  }) {
    const company = new Company({
      id,
      name: '',
      createdAt: currentDate,
    });
    const createdUser = User.create({
      id: rootUser.id,
      email: rootUser.email,
      fullName: rootUser.fullName,
      password: rootUser.password,
      companyId: company.id,
      currentDate,
    });
    return [company, createdUser] as const;
  }
  static fromSnapshot(snapshot: CompanySnapshot) {
    return new Company({
      id: snapshot.id,
      name: snapshot.name,
      createdAt: snapshot.createdAt,
    });
  }
}

type CompanyConstructorProps = {
  id: string;
  name: string;
  createdAt: Date;
};
export type CompanySnapshot = {
  id: string;
  name: string;
  createdAt: Date;
};
