import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by id' })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  getCart(@Param('id') id: string): Promise<CartResponseDto> {
    return this.service.getCart(id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ status: 201, type: CartResponseDto })
  addItem(
    @Param('id') id: string,
    @Body() dto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.service.addToCart(id, dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'itemId', description: 'Cart Item ID' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  updateQuantity(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.service.updateQuantity(itemId, dto.quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'itemId', description: 'Cart Item ID' })
  @ApiResponse({ status: 200, type: CartResponseDto })
  removeItem(@Param('itemId') itemId: string): Promise<CartResponseDto> {
    return this.service.removeItem(itemId);
  }
}
