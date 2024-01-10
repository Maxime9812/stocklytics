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

  static create({ id, currentDate }: { id: string; currentDate: Date }) {
    return new Company({
      id,
      name: '',
      createdAt: currentDate,
    });
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
