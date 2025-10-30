import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse | UploadApiErrorResponse>;
    uploadImageFromBase64(base64String: string, folder?: string): Promise<UploadApiResponse | UploadApiErrorResponse>;
    deleteImage(publicId: string): Promise<any>;
    getOptimizedUrl(publicId: string, width?: number, height?: number): string;
}
