import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  // Create shop
  async create(userId: string, createShopDto: CreateShopDto) {
    // Check if user already has a shop with this name
    const existingShop = await this.prisma.shop.findFirst({
      where: {
        ownerId: userId,
        name: createShopDto.name,
      },
    });

    if (existingShop) {
      throw new BadRequestException('You already have a shop with this name');
    }

    // Update user role to SHOP_OWNER if they're a CUSTOMER
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role === 'CUSTOMER') {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: 'SHOP_OWNER' },
      });
    }

    // Create shop
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

  // Get all shops (for browsing)
  async findAll(page: number = 1, limit: number = 10) {
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

  // Get user's shops
  async findUserShops(userId: string) {
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

  // Get shop by ID
  async findOne(id: string) {
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
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  // Update shop
  async update(id: string, userId: string, updateShopDto: UpdateShopDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    // Check ownership
    if (shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this shop',
      );
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

  // Delete shop (soft delete)
  async remove(id: string, userId: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    // Check ownership
    if (shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this shop',
      );
    }

    await this.prisma.shop.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Shop deleted successfully' };
  }

  // Check if user owns shop
  async checkOwnership(shopId: string, userId: string): Promise<boolean> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });

    return shop?.ownerId === userId;
  }
}
