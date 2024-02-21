import { ImageUploaderGateway } from '@app/inventory/write/hexagon/gateways/image-uploader.gateway';

export class StubImageUploaderGateway implements ImageUploaderGateway {
  private uploadedImages: Map<string, string> = new Map();
  deletedImage: string | undefined;
  async uploadImage({
    imageId,
    imagePath,
  }: {
    imageId: string;
    imagePath: string;
  }): Promise<string> {
    return this.uploadedImages.get(this.getImageKey({ imageId, imagePath }));
  }

  private getImageKey({
    imageId,
    imagePath,
  }: {
    imageId: string;
    imagePath: string;
  }) {
    return `${imageId}-${imagePath}`;
  }

  givenUploadedImage({
    imageId,
    imagePath,
    returnedUrl,
  }: {
    imageId: string;
    imagePath: string;
    returnedUrl: string;
  }) {
    this.uploadedImages.set(
      this.getImageKey({ imageId, imagePath }),
      returnedUrl,
    );
  }

  async deleteImage(imageId: string): Promise<void> {
    this.deletedImage = imageId;
  }
}
