import { ApiProperty } from '@nestjs/swagger';

class OrderItemResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;
}
