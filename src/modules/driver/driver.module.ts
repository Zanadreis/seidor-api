import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './driver.entity';
import { Vehicle } from '../vehicle/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver]), TypeOrmModule.forFeature([Vehicle])],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}
