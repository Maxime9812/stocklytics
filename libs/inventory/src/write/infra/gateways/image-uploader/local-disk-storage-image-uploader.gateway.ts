import { ImageUploaderGateway } from '@app/inventory/write/hexagon/gateways/image-uploader.gateway';
import * as fs from 'fs';
import * as path from 'path';

export class LocalDiskStorageImageUploaderGateway
  implements ImageUploaderGateway
{
  constructor(
    private readonly apiUploadUrl: string,
    private readonly uploadFolderPath: string,
  ) {}

  async uploadImage({
    imageId,
    imagePath,
  }: {
    imageId: string;
    imagePath: string;
  }): Promise<string> {
    const imageType = path.extname(imagePath);
    this.saveImageOnDisk(imageId, imagePath, imageType);
    return this.getImageUrl(imageId, imageType);
  }

  private saveImageOnDisk(
    imageId: string,
    imagePath: string,
    imageType: string,
  ) {
    fs.writeFileSync(
      path.join(this.uploadFolderPath, `${imageId}${imageType}`),
      fs.readFileSync(imagePath),
    );
  }

  private getImageUrl(imageId: string, imageType: string) {
    return `${this.apiUploadUrl}${imageId}${imageType}`;
  }
}
