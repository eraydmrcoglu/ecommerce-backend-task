import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(cartId: string): Promise<CartResponseDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
  }

  async addToCart(cartId: string, dto: AddToCartDto): Promise<CartResponseDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId: dto.productId,
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + dto.quantity,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    return this.getCart(cartId);
  }

  async updateQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartResponseDto> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return this.getCart(cartItem.cartId);
  }

  async removeItem(cartItemId: string): Promise<CartResponseDto> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return this.getCart(cartItem.cartId);
  }

  async createCart(userId: string) {
    return this.prisma.cart.create({
      data: { userId },
    });
  }
}
