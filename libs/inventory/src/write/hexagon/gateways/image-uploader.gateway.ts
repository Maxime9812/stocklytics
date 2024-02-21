export interface ImageUploaderGateway {
  uploadImage(payload: { imageId: string; imagePath: string }): Promise<string>;
}
