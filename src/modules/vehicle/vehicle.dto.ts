import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, IsOptional, IsIn, IsNumber } from 'class-validator';

export class createVehicleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  plate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  color: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  manufacturer: string;
}

export class updateVehicleDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  plate: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  color: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  manufacturer: string;
}

export class vehicleIdDto {
  @IsString()
  @MinLength(24)
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class searchKeysDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Generic key string to search in all viable fields. (plate, color, manufacturer)',
  })
  searchKey: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'By whitch column should order by. (plate, color, manufacturer, created_at)',
    default: 'created_at',
  })
  @IsIn(['plate', 'color', 'manufacturer', 'ocupied', 'created_at'])
  orderOption: string = 'created_at';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'ASC or DESC',
    default: 'ASC',
  })
  @IsIn(['ASC', 'DESC'])
  orderType: string = 'ASC';

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number, default: 1 })
  @Type(() => Number)
  page: number = 1;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number, default: 10 })
  @Type(() => Number)
  itemsPerPage: number = 10;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Filter exclusively by color.',
  })
  color: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Filter exclusively by manufacturer.',
  })
  manufacturer: string;
}
