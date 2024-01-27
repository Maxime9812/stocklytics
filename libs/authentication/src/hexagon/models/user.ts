export class User {
  private constructor(private props: UserConstructorProps) {}

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get companyId() {
    return this.props.companyId;
  }

  get snapshot(): UserSnapshot {
    return {
      id: this.props.id,
      email: this.props.email,
      password: this.props.password,
      fullName: this.props.fullName,
      createdAt: this.props.createdAt,
      companyId: this.props.companyId,
    };
  }

  static create({
    id,
    email,
    fullName,
    password,
    currentDate,
    companyId,
  }: {
    id: string;
    email: string;
    password: string;
    fullName: string;
    currentDate: Date;
    companyId: string;
  }) {
    return new User({
      id,
      email,
      fullName,
      password,
      createdAt: currentDate,
      companyId,
    });
  }

  static fromSnapshot(snapshot: UserSnapshot) {
    return new User({
      id: snapshot.id,
      email: snapshot.email,
      password: snapshot.password,
      fullName: snapshot.fullName,
      companyId: snapshot.companyId,
      createdAt: snapshot.createdAt,
    });
  }
}

type UserConstructorProps = {
  id: string;
  email: string;
  password: string;
  companyId: string;
  fullName: string;
  createdAt: Date;
};

export type UserSnapshot = {
  id: string;
  email: string;
  password: string;
  companyId: string;
  fullName: string;
  createdAt: Date;
};
