import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser('id') userId: string,
  ) {
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('shopId') shopId?: string,
    @Query('minPrice', new ParseFloatPipe({ optional: true }))
    minPrice?: number,
    @Query('maxPrice', new ParseFloatPipe({ optional: true }))
    maxPrice?: number,
    @Query('sortBy') sortBy?: 'createdAt' | 'price' | 'soldCount' | 'rating',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.productsService.findAll({
      page,
      limit,
      search,
      categoryId,
      shopId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });
  }

  @Get('shop/:shopId')
  @UseGuards(JwtAuthGuard)
  findShopProducts(
    @Param('shopId') shopId: string,
    @GetUser('id') userId: string,
  ) {
    return this.productsService.findShopProducts(shopId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser('id') userId: string,
  ) {
    return this.productsService.update(id, updateProductDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.productsService.remove(id, userId);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard)
  updateStock(
    @Param('id') id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
    @GetUser('id') userId: string,
  ) {
    return this.productsService.updateStock(id, quantity, userId);
  }
}
