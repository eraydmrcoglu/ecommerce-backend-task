import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Cart ID' })
  @IsUUID()
  cartId: string;
}
