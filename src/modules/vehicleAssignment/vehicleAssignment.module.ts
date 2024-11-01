import { Module } from '@nestjs/common';
import { VehicleAssignmentController } from './vehicleAssignment.controller';
import { VehicleAssignmentService } from './vehicleAssignment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleAssignment } from './vehicleAssignment.entity';
import { VehicleModule } from '../vehicle/vehicle.module';
import { DriverModule } from '../driver/driver.module';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleAssignment]), VehicleModule, DriverModule],
  controllers: [VehicleAssignmentController],
  providers: [VehicleAssignmentService],
})
export class VehicleAssignmentModule {}
