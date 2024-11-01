import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, IsOptional, IsIn, IsNumber } from 'class-validator';

export class searchKeysDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'By whitch column should order by. (driver, plate, created_at)',
    default: 'created_at',
  })
  @IsIn(['driver', 'plate', 'created_at'])
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
    description: 'Filter exclusively by driver name.',
  })
  driver: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Filter exclusively by vehicle plate.',
  })
  plate: string;
}

export class vehicleAssignmentDto {
  @IsString()
  @MinLength(24)
  @IsNotEmpty()
  @ApiProperty()
  vehicle_id: string;

  @IsString()
  @MinLength(24)
  @IsNotEmpty()
  @ApiProperty()
  driver_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  reason: string;
}

export class vehicleAssignmentIdDto {
  @IsString()
  @MinLength(24)
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}
