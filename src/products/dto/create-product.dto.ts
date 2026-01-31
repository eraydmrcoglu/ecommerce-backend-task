import { IsInt, IsNumber, IsString, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsUrl()
  imageUrl: string;

  @IsInt()
  @Min(0)
  stock: number;
}
