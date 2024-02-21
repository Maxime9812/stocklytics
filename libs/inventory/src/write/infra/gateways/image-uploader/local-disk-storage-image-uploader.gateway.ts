import { ImageUploaderGateway } from '@app/inventory/write/hexagon/gateways/image-uploader.gateway';
import * as path from 'path';
import * as fs from 'fs';

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

  async deleteImage(imageId: string): Promise<void> {
    const imagePath = fs.readdirSync(this.uploadFolderPath).find((file) => {
      return file.includes(imageId);
    });
    if (!imagePath) return;
    fs.unlinkSync(path.join(this.uploadFolderPath, imagePath));
  }
}
