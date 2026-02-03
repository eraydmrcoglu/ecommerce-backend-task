import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @ApiOperation({ summary: 'Tüm ürünleri getir' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  @Get()
  async getAll(): Promise<ProductResponseDto[]> {
    const products = await this.service.findAll();

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      stock: p.stock,
    }));
  }

  @ApiOperation({ summary: 'Ürün detayı getir' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const p = await this.service.findOne(id);

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      stock: p.stock,
    };
  }

  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @Post()
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    const p = await this.service.create(dto);

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      stock: p.stock,
    };
  }
}
