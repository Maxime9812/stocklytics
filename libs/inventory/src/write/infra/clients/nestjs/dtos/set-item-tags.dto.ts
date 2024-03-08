import { IsArray, IsUUID } from 'class-validator';

export class SetItemTagsDTO {
  @IsArray()
  @IsUUID('all', { each: true })
  tagIds: string[];
}
