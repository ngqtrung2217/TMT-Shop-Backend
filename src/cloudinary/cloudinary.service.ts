import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'tmtshop',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(new Error('Upload failed'));
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadImageFromBase64(
    base64String: string,
    folder: string = 'tmtshop',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'auto',
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  getOptimizedUrl(
    publicId: string,
    width: number = 300,
    height: number = 300,
  ): string {
    return cloudinary.url(publicId, {
      width: width,
      height: height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  }
}
