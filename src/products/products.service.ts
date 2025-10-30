import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    // Verify shop exists and user owns it
    const shop = await this.prisma.shop.findUnique({
      where: { id: createProductDto.shopId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    if (shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only create products for your own shop',
      );
    }

    // Verify category exists if provided
    if (createProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
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

  async findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    shopId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'createdAt' | 'price' | 'soldCount' | 'rating';
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    // Search by name or description
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (params?.categoryId) {
      where.categoryId = params.categoryId;
    }

    // Filter by shop
    if (params?.shopId) {
      where.shopId = params.shopId;
    }

    // Filter by price range
    if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) {
        where.price.gte = params.minPrice;
      }
      if (params.maxPrice !== undefined) {
        where.price.lte = params.maxPrice;
      }
    }

    // Sorting
    const orderBy: any = {};
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

  async findOne(id: string) {
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
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findShopProducts(shopId: string, userId: string) {
    // Verify user owns the shop
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    if (shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only view products from your own shop',
      );
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

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.shop.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    // Verify category if being updated
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Cannot change shopId
    if (updateProductDto.shopId && updateProductDto.shopId !== product.shopId) {
      throw new BadRequestException('Cannot change product shop');
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

  async remove(id: string, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.shop.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    // Soft delete
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Product deleted successfully' };
  }

  async updateStock(id: string, quantity: number, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { shop: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only update stock for your own products',
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: quantity },
    });
  }
}
