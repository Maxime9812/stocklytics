export class User {
  private constructor(private props: UserConstructorProps) {}

  get id() {
    return this.props.id;
  }

  get snapshot(): UserSnapshot {
    return {
      id: this.props.id,
      email: this.props.email,
      password: this.props.password,
      createdAt: this.props.createdAt,
    };
  }

  static create({
    id,
    email,
    password,
    currentDate,
  }: {
    id: string;
    email: string;
    password: string;
    currentDate: Date;
  }) {
    return new User({ id, email, password, createdAt: currentDate });
  }

  static fromSnapshot(snapshot: UserSnapshot) {
    return new User({
      id: snapshot.id,
      email: snapshot.email,
      password: snapshot.password,
      createdAt: snapshot.createdAt,
    });
  }
}

type UserConstructorProps = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
};

export type UserSnapshot = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
};
