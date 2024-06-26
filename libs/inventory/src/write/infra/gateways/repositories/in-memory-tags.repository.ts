import { TagsRepository } from '@app/inventory/write/hexagon/gateways/repositories/tags.repository';
import { Tag, TagSnapshot } from '@app/inventory/write/hexagon/models/tag';

export class InMemoryTagsRepository implements TagsRepository {
  private _tags: Map<string, TagSnapshot> = new Map();
  async save(tag: Tag): Promise<void> {
    this._tags.set(tag.id, tag.snapshot);
  }

  async getById(id: string): Promise<Tag | undefined> {
    return this._tags.has(id)
      ? Tag.fromSnapshot(this._tags.get(id))
      : undefined;
  }

  async tagWithNameExists(name: string): Promise<boolean> {
    return [...this._tags.values()].some((tag) => tag.name === name);
  }

  givenTags(...tags: Tag[]) {
    tags.forEach((tag) => this._tags.set(tag.id, tag.snapshot));
  }

  get tags() {
    return [...this._tags.values()].map((tag) => Tag.fromSnapshot(tag));
  }
}
