import { Tag } from '@app/inventory/write/hexagon/models/tag';

export class Item {
  private constructor(private props: ItemConstructorProps) {}

  get id() {
    return this.props.id;
  }

  get snapshot(): ItemSnapshot {
    return {
      id: this.props.id,
      companyId: this.props.companyId,
      name: this.props.name,
      quantity: this.props.quantity,
      tagIds: this.props.tagIds,
      folderId: this.props.folderId,
      createdAt: this.props.createdAt,
    };
  }

  addTag(tag: Tag) {
    const tagAlreadyAdded = this.props.tagIds.includes(tag.id);
    if (tagAlreadyAdded) return;
    this.props.tagIds.push(tag.id);
  }

  removeTag(tagId: string) {
    this.props.tagIds = this.props.tagIds.filter((id) => id !== tagId);
  }

  moveIntoFolder(folderId: string) {
    this.props.folderId = folderId;
  }

  static create(params: {
    id: string;
    companyId: string;
    name: string;
    quantity: number;
    currentDate: Date;
  }) {
    return new Item({
      id: params.id,
      companyId: params.companyId,
      name: params.name,
      quantity: params.quantity,
      tagIds: [],
      folderId: undefined,
      createdAt: params.currentDate,
    });
  }

  static fromSnapshot(snapshot: ItemSnapshot) {
    return new Item({
      id: snapshot.id,
      companyId: snapshot.companyId,
      name: snapshot.name,
      quantity: snapshot.quantity,
      tagIds: [...snapshot.tagIds],
      folderId: snapshot.folderId,
      createdAt: snapshot.createdAt,
    });
  }
}

type ItemConstructorProps = {
  id: string;
  companyId: string;
  name: string;
  quantity: number;
  tagIds: string[];
  folderId?: string;
  createdAt: Date;
};
export type ItemSnapshot = {
  id: string;
  companyId: string;
  name: string;
  quantity: number;
  tagIds: string[];
  folderId?: string;
  createdAt: Date;
};
