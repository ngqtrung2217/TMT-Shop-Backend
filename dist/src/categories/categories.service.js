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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    async create(createCategoryDto) {
        const slug = this.generateSlug(createCategoryDto.name);
        const existing = await this.prisma.category.findFirst({
            where: {
                OR: [{ name: createCategoryDto.name }, { slug }],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Category with this name already exists');
        }
        return this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                slug,
                image: createCategoryDto.image,
            },
        });
    }
    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug ${slug} not found`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        await this.findOne(id);
        const data = {};
        if (updateCategoryDto.name) {
            const slug = this.generateSlug(updateCategoryDto.name);
            const existing = await this.prisma.category.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        {
                            OR: [{ name: updateCategoryDto.name }, { slug }],
                        },
                    ],
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Category with this name already exists');
            }
            data.name = updateCategoryDto.name;
            data.slug = slug;
        }
        if (updateCategoryDto.image !== undefined) {
            data.image = updateCategoryDto.image;
        }
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        const productsCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productsCount > 0) {
            throw new common_1.ConflictException(`Cannot delete category with ${productsCount} products. Please reassign or delete products first.`);
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map