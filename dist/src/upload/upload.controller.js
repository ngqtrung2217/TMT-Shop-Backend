"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UploadController = class UploadController {
    cloudinaryService;
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    validateImage(file) {
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/webp',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only image files are allowed (jpeg, png, jpg, webp)');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size must not exceed 5MB');
        }
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
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
    async uploadAvatar(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        this.validateImage(file);
        const result = await this.cloudinaryService.uploadImage(file, 'tmtshop/avatars');
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
    async uploadShopLogo(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        this.validateImage(file);
        const result = await this.cloudinaryService.uploadImage(file, 'tmtshop/shops/logos');
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
    async uploadShopBanner(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        this.validateImage(file);
        const result = await this.cloudinaryService.uploadImage(file, 'tmtshop/shops/banners');
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
    async uploadProductImages(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        if (files.length > 10) {
            throw new common_1.BadRequestException('Maximum 10 images allowed per product');
        }
        files.forEach((file) => this.validateImage(file));
        const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'tmtshop/products'));
        const results = await Promise.all(uploadPromises);
        return {
            images: results.map((result) => ({
                url: result.secure_url,
                publicId: result.public_id,
            })),
            count: results.length,
        };
    }
    async uploadCategoryImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        this.validateImage(file);
        const result = await this.cloudinaryService.uploadImage(file, 'tmtshop/categories');
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Post)('shop-logo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadShopLogo", null);
__decorate([
    (0, common_1.Post)('shop-banner'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadShopBanner", null);
__decorate([
    (0, common_1.Post)('product-images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProductImages", null);
__decorate([
    (0, common_1.Post)('category-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadCategoryImage", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map