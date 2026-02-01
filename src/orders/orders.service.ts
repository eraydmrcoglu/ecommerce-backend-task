import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart not found or empty');
    }

    const totalAmount = cart.items.reduce(
      (sum, item) =>
        sum + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        totalAmount,
        userId: cart.userId, // ✅ KRİTİK SATIR
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: true, // ✅ items erişimi için şart
      },
    });

    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });

    return {
      id: order.id,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    };
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order.id,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    };
  }
}
