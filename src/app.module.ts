import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './modules/health/health.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { DriverModule } from './modules/driver/driver.module';
import { ApiExcludeController } from '@nestjs/swagger';
import { VehicleAssignmentModule } from './modules/vehicleAssignment/vehicleAssignment.module';

@ApiExcludeController()
@Controller()
class AppController {
  @Get()
  root() {
    return { message: 'API made by Zanadreis. See documentation at /docs' };
  }
}
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_CONNECTION_STRING,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    HealthModule,
    VehicleModule,
    DriverModule,
    VehicleAssignmentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
