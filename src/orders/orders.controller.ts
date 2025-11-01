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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @GetUser('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll({ page, limit, status });
  }

  @Get('my-orders')
  findUserOrders(
    @GetUser('id') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.ordersService.findUserOrders(userId, page, limit);
  }

  @Get('shop/:shopId')
  findShopOrders(
    @Param('shopId') shopId: string,
    @GetUser('userId') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.ordersService.findShopOrders(shopId, userId, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.ordersService.findOne(id, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, userId, updateOrderStatusDto);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @GetUser('userId') userId: string) {
    return this.ordersService.cancel(id, userId);
  }
}
