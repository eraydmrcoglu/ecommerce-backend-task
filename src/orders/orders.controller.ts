import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Sepetten sipariş oluştur' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async create(
    @Body('cartId') cartId: string,
  ): Promise<OrderResponseDto> {
    return this.service.createOrder(cartId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Sipariş detayını getir' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async getOne(
    @Param('id') id: string,
  ): Promise<OrderResponseDto> {
    return this.service.getOrder(id);
  }
}
