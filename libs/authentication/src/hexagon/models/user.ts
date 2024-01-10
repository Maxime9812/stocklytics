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

  get snapshot(): UserSnapshot {
    return {
      id: this.props.id,
      email: this.props.email,
      password: this.props.password,
      createdAt: this.props.createdAt,
      companyId: this.props.companyId,
    };
  }

  static create({
    id,
    email,
    password,
    currentDate,
    companyId,
  }: {
    id: string;
    email: string;
    password: string;
    currentDate: Date;
    companyId: string;
  }) {
    return new User({ id, email, password, createdAt: currentDate, companyId });
  }

  static fromSnapshot(snapshot: UserSnapshot) {
    return new User({
      id: snapshot.id,
      email: snapshot.email,
      password: snapshot.password,
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
  createdAt: Date;
};

export type UserSnapshot = {
  id: string;
  email: string;
  password: string;
  companyId: string;
  createdAt: Date;
};
