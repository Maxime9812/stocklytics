import { Tag } from '@app/inventory/write/hexagon/models/tag';

export interface TagsRepository {
  save(tag: Tag): Promise<void>;
  tagWithNameExists(name: string): Promise<boolean>;
}
