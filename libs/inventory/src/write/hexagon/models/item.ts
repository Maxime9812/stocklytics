import { Tag } from '@app/inventory/write/hexagon/models/tag';
import { Barcode } from '@app/inventory/write/hexagon/models/barcode';
import { Either, left, right } from 'fp-ts/Either';

export class ItemQuantityCannotBeNegativeError {
  readonly type = 'ItemQuantityCannotBeNegativeError';
}

export type ItemImage = {
  id: string;
  itemId: string;
  url: string;
};

export class Item {
  private constructor(private props: ItemConstructorProps) {}

  get id() {
    return this.props.id;
  }

  get image() {
    return this.props.image;
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
      image: this.props.image,
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

  setTags(tagIds: string[]) {
    this.props.tagIds = tagIds;
  }

  moveIntoFolder(folderId: string) {
    this.props.folderId = folderId;
  }

  linkBarcode(barcode: Barcode) {
    this.props.barcode = barcode;
  }

  unlinkBarcode() {
    this.props.barcode = undefined;
  }

  editNote(note: string) {
    this.props.note = note;
  }

  changeName(name: string) {
    this.props.name = name;
  }

  adjustQuantity(
    quantity: number,
  ): Either<ItemQuantityCannotBeNegativeError, void> {
    if (this.props.quantity + quantity < 0)
      return left(new ItemQuantityCannotBeNegativeError());
    this.props.quantity += quantity;
    return right(undefined);
  }

  addImage(image: { id: string; url: string }) {
    this.props.image = {
      id: image.id,
      itemId: this.id,
      url: image.url,
    };
  }

  deleteImage() {
    this.props.image = undefined;
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
      image: snapshot.image,
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
  image?: ItemImage;
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
  image?: ItemImage;
  createdAt: Date;
};
