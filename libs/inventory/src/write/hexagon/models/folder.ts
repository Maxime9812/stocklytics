export class Folder {
  private constructor(private props: FolderConstructorProps) {}

  get id() {
    return this.props.id;
  }

  get snapshot(): FolderSnapshot {
    return {
      id: this.props.id,
      name: this.props.name,
      companyId: this.props.companyId,
      parentId: this.props.parentId,
      createdAt: this.props.createdAt,
    };
  }

  moveToFolder(parentId: string) {
    this.props.parentId = parentId;
  }

  static create({
    id,
    name,
    companyId,
    parentId,
    currentDate,
  }: {
    id: string;
    name: string;
    companyId: string;
    parentId?: string;
    currentDate: Date;
  }) {
    return new Folder({
      id,
      name,
      companyId,
      parentId,
      createdAt: currentDate,
    });
  }

  static fromSnapshot(snapshot: FolderSnapshot) {
    return new Folder({
      id: snapshot.id,
      name: snapshot.name,
      companyId: snapshot.companyId,
      parentId: snapshot.parentId,
      createdAt: snapshot.createdAt,
    });
  }
}

type FolderConstructorProps = {
  id: string;
  name: string;
  companyId: string;
  parentId?: string;
  createdAt: Date;
};

export type FolderSnapshot = {
  id: string;
  name: string;
  companyId: string;
  parentId?: string;
  createdAt: Date;
};
