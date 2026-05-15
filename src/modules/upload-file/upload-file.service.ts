import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { randomBytes } from 'crypto';
import { Readable } from 'stream';

const IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
];

const AUDIO_MIMES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/x-m4a',
  'audio/aac',
];

const DOCUMENT_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
];

@Injectable()
export class UploadFileService {
  private readonly r2Client: S3Client;
  private readonly r2Bucket: string;
  private readonly r2PublicUrl: string;
  private readonly catboxApiUrl = 'https://catbox.moe/user/api.php';
  private readonly catboxUserhash: string;

  constructor(private readonly configService: ConfigService) {
    this.catboxUserhash =
      this.configService.get<string>('CATBOX_USERHASH') || '';

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    const endpoint = this.configService.get<string>('R2_ENDPOINT') || '';
    this.r2Bucket = this.configService.get<string>('R2_BUCKET') || 'fms';
    this.r2PublicUrl = this.configService.get<string>('R2_PUBLIC_URL') || '';

    this.r2Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('R2_SECRET_ACCESS_KEY') || '',
      },
      forcePathStyle: true,
    });
  }

  private generateFileId(): string {
    const now = new Date();
    const random = randomBytes(6).toString('hex');
    return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-${random}`;
  }

  private detectFileCategory(
    mimetype: string,
  ): 'image' | 'audio' | 'document' | 'other' {
    if (IMAGE_MIMES.includes(mimetype)) return 'image';
    if (AUDIO_MIMES.includes(mimetype)) return 'audio';
    if (DOCUMENT_MIMES.includes(mimetype)) return 'document';
    return 'other';
  }

  private getExtension(mimetype: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/avif': 'avif',
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'audio/webm': 'webm',
      'audio/x-m4a': 'm4a',
      'audio/aac': 'aac',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'pptx',
      'text/plain': 'txt',
      'text/csv': 'csv',
    };
    return map[mimetype] || 'bin';
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ fileName: string; fileUrl: string }> {
    const folderName = folder || 'fms-images';
    const fileId = this.generateFileId();
    const ext = this.getExtension(file.mimetype);

    const options: UploadApiOptions = {
      folder: folderName,
      public_id: fileId,
      resource_type: 'auto',
    };

    try {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        base64,
        options,
      );
      return { fileName: `${fileId}.${ext}`, fileUrl: result.secure_url };
    } catch (err) {
      throw new InternalServerErrorException(
        `Upload Cloudinary thất bại: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  private async uploadToR2(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ fileName: string; fileUrl: string }> {
    const fileId = this.generateFileId();
    const ext = this.getExtension(file.mimetype);
    const key = folder ? `${folder}/${fileId}.${ext}` : `${fileId}.${ext}`;

    try {
      const parallelUpload = new Upload({
        client: this.r2Client,
        params: {
          Bucket: this.r2Bucket,
          Key: key,
          Body: Readable.from(file.buffer),
          ContentType: file.mimetype,
        },
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
      });

      await parallelUpload.done();
      return {
        fileName: `${fileId}.${ext}`,
        fileUrl: `${this.r2PublicUrl}/${key}`,
      };
    } catch (err) {
      throw new InternalServerErrorException(
        `Upload R2 thất bại: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  private async uploadToCatbox(
    file: Express.Multer.File,
  ): Promise<{ fileName: string; fileUrl: string }> {
    const ext = this.getExtension(file.mimetype);
    const fileName = `${this.generateFileId()}.${ext}`;

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    if (this.catboxUserhash) {
      formData.append('userhash', this.catboxUserhash);
    }
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype,
    });
    formData.append('fileToUpload', blob, file.originalname);

    try {
      const response = await fetch(this.catboxApiUrl, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Catbox API returned status ${response.status}`);
      }
      const fileUrl = (await response.text()).trim();
      return { fileName, fileUrl };
    } catch (err) {
      throw new InternalServerErrorException(
        `Upload Catbox thất bại: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async uploadToCatboxFromUrl(
    url: string,
  ): Promise<{ fileName: string; fileUrl: string; storage: string }> {
    if (!url) throw new BadRequestException('URL is required');

    const formData = new FormData();
    formData.append('reqtype', 'urlupload');
    if (this.catboxUserhash) {
      formData.append('userhash', this.catboxUserhash);
    }
    formData.append('url', url);

    try {
      const response = await fetch(this.catboxApiUrl, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Catbox API returned status ${response.status}`);
      }
      const fileUrl = (await response.text()).trim();
      const fileName = url.split('/').pop() || `${this.generateFileId()}.bin`;
      return { fileName, fileUrl, storage: 'catbox' };
    } catch (err) {
      throw new InternalServerErrorException(
        `Upload URL to Catbox thất bại: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async uploadCatbox(
    file: Express.Multer.File,
  ): Promise<{ fileName: string; fileUrl: string; storage: string }> {
    if (!file) throw new BadRequestException('File is required');
    const result = await this.uploadToCatbox(file);
    return { ...result, storage: 'catbox' };
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ fileName: string; fileUrl: string; storage: string }> {
    if (!file) throw new BadRequestException('File is required');
    const result = await this.uploadToCloudinary(file, folder);
    return { ...result, storage: 'cloudinary' };
  }

  async uploadAudio(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ fileName: string; fileUrl: string; storage: string }> {
    if (!file) throw new BadRequestException('File is required');
    const result = await this.uploadToR2(file, folder || 'audio');
    return { ...result, storage: 'r2' };
  }

  async uploadDocument(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ fileName: string; fileUrl: string; storage: string }> {
    if (!file) throw new BadRequestException('File is required');
    const result = await this.uploadToR2(file, folder || 'documents');
    return { ...result, storage: 'r2' };
  }

  async uploadSingle(
    file: Express.Multer.File,
  ): Promise<{ fileName: string; fileUrl: string; storage: string }> {
    if (!file) throw new BadRequestException('File is required');
    const category = this.detectFileCategory(file.mimetype);

    switch (category) {
      case 'image':
        return this.uploadImage(file);
      case 'audio':
        return this.uploadAudio(file);
      case 'document':
        return this.uploadDocument(file);
      default:
        return this.uploadDocument(file);
    }
  }

  async uploadMulti(
    files: Array<Express.Multer.File>,
  ): Promise<Array<{ fileName: string; fileUrl: string; storage: string }>> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Danh sách file trống');
    }
    return Promise.all(files.map((f) => this.uploadSingle(f)));
  }
}
