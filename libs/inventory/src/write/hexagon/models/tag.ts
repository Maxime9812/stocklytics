export class Tag {
  private constructor(private props: TagConstructorProps) {}

  get id() {
    return this.props.id;
  }

  get snapshot(): TagSnapshot {
    return {
      id: this.props.id,
      name: this.props.name,
      companyId: this.props.companyId,
      createdAt: this.props.createdAt,
    };
  }

  static create({
    id,
    name,
    companyId,
    currentDate,
  }: {
    id: string;
    name: string;
    companyId: string;
    currentDate: Date;
  }) {
    return new Tag({ id, name, companyId, createdAt: currentDate });
  }

  static fromSnapshot(snapshot: TagSnapshot) {
    return new Tag({
      id: snapshot.id,
      name: snapshot.name,
      companyId: snapshot.companyId,
      createdAt: snapshot.createdAt,
    });
  }
}

type TagConstructorProps = {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
};
export type TagSnapshot = {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
};
