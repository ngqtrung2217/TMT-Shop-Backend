import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class UploadController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    private validateImage;
    uploadImage(file: Express.Multer.File): Promise<{
        url: any;
        publicId: any;
        format: any;
        width: any;
        height: any;
    }>;
    uploadAvatar(file: Express.Multer.File): Promise<{
        url: any;
        publicId: any;
    }>;
    uploadShopLogo(file: Express.Multer.File): Promise<{
        url: any;
        publicId: any;
    }>;
    uploadShopBanner(file: Express.Multer.File): Promise<{
        url: any;
        publicId: any;
    }>;
    uploadProductImages(files: Express.Multer.File[]): Promise<{
        images: {
            url: any;
            publicId: any;
        }[];
        count: number;
    }>;
    uploadCategoryImage(file: Express.Multer.File): Promise<{
        url: any;
        publicId: any;
    }>;
}
