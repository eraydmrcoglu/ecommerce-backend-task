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
  getAll(): Promise<ProductResponseDto[]> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Ürün detayı getir' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Yeni ürün oluştur' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @Post()
  create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.service.create(dto);
  }
}
