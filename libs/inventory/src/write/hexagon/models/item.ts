import { Tag } from '@app/inventory/write/hexagon/models/tag';
import { Barcode } from '@app/inventory/write/hexagon/models/barcode';

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
      note: this.props.note,
      folderId: this.props.folderId,
      barcode: this.props.barcode,
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

  linkBarcode(barcode: Barcode) {
    this.props.barcode = barcode;
  }

  static create(params: {
    id: string;
    companyId: string;
    name: string;
    quantity: number;
    currentDate: Date;
    folderId?: string;
  }) {
    return new Item({
      id: params.id,
      companyId: params.companyId,
      name: params.name,
      quantity: params.quantity,
      tagIds: [],
      note: '',
      folderId: params.folderId,
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
      note: snapshot.note,
      barcode: snapshot.barcode,
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
  note: string;
  barcode?: Barcode;
  createdAt: Date;
};
export type ItemSnapshot = {
  id: string;
  companyId: string;
  name: string;
  quantity: number;
  tagIds: string[];
  folderId?: string;
  note: string;
  barcode?: Barcode;
  createdAt: Date;
};
