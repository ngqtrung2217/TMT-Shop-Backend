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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ShopsService = class ShopsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createShopDto) {
        const existingShop = await this.prisma.shop.findFirst({
            where: {
                ownerId: userId,
                name: createShopDto.name,
            },
        });
        if (existingShop) {
            throw new common_1.BadRequestException('You already have a shop with this name');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (user?.role === 'CUSTOMER') {
            await this.prisma.user.update({
                where: { id: userId },
                data: { role: 'SHOP_OWNER' },
            });
        }
        const shop = await this.prisma.shop.create({
            data: {
                ...createShopDto,
                ownerId: userId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return shop;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [shops, total] = await Promise.all([
            this.prisma.shop.findMany({
                where: { isActive: true },
                skip,
                take: limit,
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    _count: {
                        select: { products: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.shop.count({ where: { isActive: true } }),
        ]);
        return {
            data: shops,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findUserShops(userId) {
        const shops = await this.prisma.shop.findMany({
            where: { ownerId: userId },
            include: {
                _count: {
                    select: { products: true, orders: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return shops;
    }
    async findOne(id) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: { products: true, orders: true },
                },
            },
        });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        return shop;
    }
    async update(id, userId, updateShopDto) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
        });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        if (shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this shop');
        }
        const updatedShop = await this.prisma.shop.update({
            where: { id },
            data: updateShopDto,
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return updatedShop;
    }
    async remove(id, userId) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
        });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        if (shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this shop');
        }
        await this.prisma.shop.update({
            where: { id },
            data: { isActive: false },
        });
        return { message: 'Shop deleted successfully' };
    }
    async checkOwnership(shopId, userId) {
        const shop = await this.prisma.shop.findUnique({
            where: { id: shopId },
        });
        return shop?.ownerId === userId;
    }
};
exports.ShopsService = ShopsService;
exports.ShopsService = ShopsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShopsService);
//# sourceMappingURL=shops.service.js.map