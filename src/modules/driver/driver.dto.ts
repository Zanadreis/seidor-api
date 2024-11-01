import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength, IsIn, IsOptional } from 'class-validator';

export class createDriverDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export class driverIdDto {
  @IsString()
  @MinLength(24)
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class editDriverDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name: string;
}

export class searchKeysDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'By whitch column should order by. (name or created_at)',
    default: 'created_at',
  })
  @IsIn(['name', 'created_at'])
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
    description: 'Filter exclusively by name.',
  })
  name: string;
}
