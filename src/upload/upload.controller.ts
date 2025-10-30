import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  private validateImage(file: Express.Multer.File) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only image files are allowed (jpeg, png, jpg, webp)',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateImage(file);

    const result = await this.cloudinaryService.uploadImage(file);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateImage(file);

    const result = await this.cloudinaryService.uploadImage(
      file,
      'tmtshop/avatars',
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  @Post('shop-logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadShopLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateImage(file);

    const result = await this.cloudinaryService.uploadImage(
      file,
      'tmtshop/shops/logos',
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  @Post('shop-banner')
  @UseInterceptors(FileInterceptor('file'))
  async uploadShopBanner(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateImage(file);

    const result = await this.cloudinaryService.uploadImage(
      file,
      'tmtshop/shops/banners',
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  @Post('product-images')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 images per product
  async uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 images allowed per product');
    }

    // Validate all files
    files.forEach((file) => this.validateImage(file));

    // Upload all files to Cloudinary
    const uploadPromises = files.map((file) =>
      this.cloudinaryService.uploadImage(file, 'tmtshop/products'),
    );

    const results = await Promise.all(uploadPromises);

    return {
      images: results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      })),
      count: results.length,
    };
  }

  @Post('category-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCategoryImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.validateImage(file);

    const result = await this.cloudinaryService.uploadImage(
      file,
      'tmtshop/categories',
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
