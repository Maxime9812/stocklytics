import { LocalDiskStorageImageUploaderGateway } from '@app/inventory/write/infra/gateways/image-uploader/local-disk-storage-image-uploader.gateway';
import * as path from 'path';
import * as fs from 'fs';

const uploadFolderPath = path.join(__dirname, 'uploads/');
const fixtureFolderPath = path.join(__dirname, 'fixtures/');
const apiUploadUrl = 'http://localhost:3000/images/';

describe('LocalDiskStorageImageUploaderGateway', () => {
  let imageUploaderGateway: LocalDiskStorageImageUploaderGateway;

  beforeEach(() => {
    imageUploaderGateway = new LocalDiskStorageImageUploaderGateway(
      apiUploadUrl,
      uploadFolderPath,
    );
  });

  afterEach(() => {
    deletesFilesInUploadsFolder();
  });

  it.each([
    {
      type: 'png',
    },
    {
      type: 'jpg',
    },
  ])('Should save image on disk with type $type', async ({ type }) => {
    const imageId = 'image-id';
    const imagePath = path.join(fixtureFolderPath, `image1.${type}`);

    await imageUploaderGateway.uploadImage({
      imageId,
      imagePath,
    });

    expect(
      fs.existsSync(path.join(uploadFolderPath, `${imageId}.${type}`)),
    ).toBe(true);
  });

  it('Should save the image on disk with the correct content', async () => {
    const imageId = 'image-id';
    const imagePath = path.join(fixtureFolderPath, 'image1.png');
    const imageContent = fs.readFileSync(imagePath);

    await imageUploaderGateway.uploadImage({
      imageId,
      imagePath,
    });

    const savedImageContent = fs.readFileSync(
      path.join(uploadFolderPath, `${imageId}.png`),
    );

    expect(savedImageContent).toEqual(imageContent);
  });

  it.each([
    {
      type: 'png',
    },
    {
      type: 'jpg',
    },
  ])('Should return the image url with type $type', async ({ type }) => {
    const imageId = 'image-id';
    const imagePath = path.join(fixtureFolderPath, `image1.${type}`);

    const imageUrl = await imageUploaderGateway.uploadImage({
      imageId,
      imagePath,
    });

    expect(imageUrl).toEqual(`${apiUploadUrl}${imageId}.${type}`);
  });

  const deletesFilesInUploadsFolder = () => {
    const files = fs
      .readdirSync(uploadFolderPath)
      .filter((file) => !file.includes('.gitkeep'));

    for (const file of files) {
      fs.unlinkSync(path.join(uploadFolderPath, file));
    }
  };
});
