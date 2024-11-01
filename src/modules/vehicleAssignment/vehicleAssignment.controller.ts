import { Body, Param, Controller, Get, Post, BadRequestException, NotFoundException, Query } from '@nestjs/common';
import { VehicleAssignmentService } from './vehicleAssignment.service';
import { searchKeysDto, vehicleAssignmentDto, vehicleAssignmentIdDto } from './vehicleAssignment.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { vehicleAssignmentSwagger } from '../../swagger/vehicleAssignment.swagger';
import { VehicleService } from '../vehicle/vehicle.service';
import { DriverService } from '../driver/driver.service';

@Controller('vehicleAssignment')
@ApiTags('VehicleAssignment')
export class VehicleAssignmentController {
  constructor(
    private readonly vehicleAssignmentService: VehicleAssignmentService,
    private readonly vehicleService: VehicleService,
    private readonly driverService: DriverService,
  ) {}

  @Get()
  @ApiOperation({ summary: `List all or filter vehicle assignments` })
  @ApiResponse({ status: 200, type: vehicleAssignmentSwagger, isArray: true })
  async listAllVehicleAssignments(@Query() query: searchKeysDto) {
    const { orderOption, orderType, page, itemsPerPage, driver, plate } = query;
    const vehicleAssignment = this.vehicleAssignmentService.listAllVehicleAssignments({ orderOption, orderType, page, itemsPerPage, driver, plate });
    if (!vehicleAssignment) throw new BadRequestException('Ops! Something went wrong');
    return vehicleAssignment;
  }

  @Get(':id')
  @ApiOperation({ summary: `List a vehicle assignment by it's Id` })
  @ApiResponse({ status: 200, type: vehicleAssignmentSwagger })
  async getOneVehicleAssignment(@Param() params: vehicleAssignmentIdDto) {
    const { id } = params;
    const vehicleAssignment = await this.vehicleAssignmentService.getById(id);
    if (!vehicleAssignment) throw new NotFoundException('Could not find vehicleAssignment');
    return vehicleAssignment;
  }

  @Post('/assign')
  @ApiOperation({ summary: `Create a vehicle assignment` })
  @ApiResponse({ status: 201, type: vehicleAssignmentSwagger })
  async createVehicleAssignment(@Body() body: vehicleAssignmentDto) {
    const { vehicle_id, driver_id, reason } = body;

    const vehicleExists = await this.vehicleService.vehicleExists(vehicle_id);
    if (!vehicleExists) throw new NotFoundException('Could not find vehicle');
    const driverExists = await this.driverService.driverExists(driver_id);
    if (!driverExists) throw new NotFoundException('Could not find driver');

    const vehicleAssignment = this.vehicleAssignmentService.createVehicleAssignment({
      vehicle_id,
      driver_id,
      reason,
    });

    if (!vehicleAssignment) throw new BadRequestException('Ops! Something went wrong');
    return vehicleAssignment;
  }

  @Post('/unassign')
  @ApiOperation({ summary: `Unassign a vehicle` })
  @ApiResponse({ status: 201, type: vehicleAssignmentSwagger })
  async createVehicleUnassignment(@Body() body: vehicleAssignmentIdDto) {
    const { id } = body;
    const vehicleUnassignment = this.vehicleAssignmentService.createVehicleUnassignment(id);
    if (!vehicleUnassignment) throw new BadRequestException('Ops! Something went wrong');
    return vehicleUnassignment;
  }
}
