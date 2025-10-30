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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto, userId) {
        const shop = await this.prisma.shop.findUnique({
            where: { id: createProductDto.shopId },
        });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        if (shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only create products for your own shop');
        }
        if (createProductDto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: createProductDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        return this.prisma.product.create({
            data: {
                name: createProductDto.name,
                description: createProductDto.description,
                price: createProductDto.price,
                discount: createProductDto.discount || 0,
                stock: createProductDto.stock,
                images: createProductDto.images || [],
                shopId: createProductDto.shopId,
                categoryId: createProductDto.categoryId,
            },
            include: {
                shop: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
    }
    async findAll(params) {
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        if (params?.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params?.categoryId) {
            where.categoryId = params.categoryId;
        }
        if (params?.shopId) {
            where.shopId = params.shopId;
        }
        if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
            where.price = {};
            if (params.minPrice !== undefined) {
                where.price.gte = params.minPrice;
            }
            if (params.maxPrice !== undefined) {
                where.price.lte = params.maxPrice;
            }
        }
        const orderBy = {};
        const sortBy = params?.sortBy || 'createdAt';
        const sortOrder = params?.sortOrder || 'desc';
        orderBy[sortBy] = sortOrder;
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    shop: {
                        select: {
                            id: true,
                            name: true,
                            logo: true,
                            rating: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    _count: {
                        select: {
                            reviews: true,
                        },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                shop: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        banner: true,
                        rating: true,
                        ownerId: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                reviews: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findShopProducts(shopId, userId) {
        const shop = await this.prisma.shop.findUnique({
            where: { id: shopId },
        });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        if (shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only view products from your own shop');
        }
        return this.prisma.product.findMany({
            where: { shopId },
            orderBy: { createdAt: 'desc' },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        });
    }
    async update(id, updateProductDto, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { shop: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        if (updateProductDto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: updateProductDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        if (updateProductDto.shopId && updateProductDto.shopId !== product.shopId) {
            throw new common_1.BadRequestException('Cannot change product shop');
        }
        return this.prisma.product.update({
            where: { id },
            data: {
                name: updateProductDto.name,
                description: updateProductDto.description,
                price: updateProductDto.price,
                discount: updateProductDto.discount,
                stock: updateProductDto.stock,
                images: updateProductDto.images,
                categoryId: updateProductDto.categoryId,
            },
            include: {
                shop: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
    }
    async remove(id, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { shop: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own products');
        }
        await this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
        return { message: 'Product deleted successfully' };
    }
    async updateStock(id, quantity, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { shop: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update stock for your own products');
        }
        return this.prisma.product.update({
            where: { id },
            data: { stock: quantity },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map