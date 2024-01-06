import { Tag } from '@app/inventory/write/hexagon/models/tag';
import { Folder } from '@app/inventory/write/hexagon/models/folder';

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
      price: this.props.price,
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

  moveIntoFolder(folder: Folder) {
    this.props.folderId = folder.id;
  }

  static create(params: {
    id: string;
    companyId: string;
    name: string;
    quantity: number;
    price: number;
    currentDate: Date;
  }) {
    return new Item({
      id: params.id,
      companyId: params.companyId,
      name: params.name,
      quantity: params.quantity,
      price: params.price,
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
      price: snapshot.price,
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
  price: number;
  tagIds: string[];
  folderId?: string;
  createdAt: Date;
};
export type ItemSnapshot = {
  id: string;
  companyId: string;
  name: string;
  quantity: number;
  price: number;
  tagIds: string[];
  folderId?: string;
  createdAt: Date;
};
