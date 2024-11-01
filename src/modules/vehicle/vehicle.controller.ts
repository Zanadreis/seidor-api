import { Body, Param, Controller, Get, Post, BadRequestException, NotFoundException, Delete, Put, Query, ConflictException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { createVehicleDto, searchKeysDto, updateVehicleDto, vehicleIdDto } from './vehicle.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { vehicleSwagger } from '../../swagger/vehicle.swagger';

@Controller('vehicle')
@ApiTags('Vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @ApiOperation({ summary: `List all or filter vehicles` })
  @ApiResponse({ status: 200, type: vehicleSwagger, isArray: true })
  async listAllVehicles(@Query() query: searchKeysDto) {
    const { searchKey, orderOption, orderType, page, itemsPerPage, color, manufacturer } = query;
    const vehicle = this.vehicleService.listAllVehicles({ searchKey, orderOption, orderType, page, itemsPerPage, color, manufacturer });
    if (!vehicle) throw new BadRequestException('Ops! Something went wrong');
    return vehicle;
  }

  @Get(':id')
  @ApiOperation({ summary: `List a vehicle by it's Id` })
  @ApiResponse({ status: 200, type: vehicleSwagger })
  async getOneVehicle(@Param() params: vehicleIdDto) {
    const { id } = params;
    const vehicle = await this.vehicleService.getById(id);
    if (!vehicle) throw new NotFoundException('Could not find vehicle');
    return vehicle;
  }

  @Post()
  @ApiOperation({ summary: `Create a vehicle` })
  @ApiResponse({ status: 201, type: vehicleSwagger })
  async createVehicle(@Body() body: createVehicleDto) {
    const { plate, color, manufacturer } = body;
    const isPlateInUse = await this.vehicleService.getByPlate(plate);
    if (isPlateInUse) throw new ConflictException('This plate is already in use');
    const vehicle = this.vehicleService.createVehicle({ plate, color, manufacturer });
    return vehicle;
  }

  @Put(':id')
  @ApiOperation({ summary: `Update a vehicle` })
  @ApiResponse({ status: 201, type: vehicleSwagger })
  async updateVehicle(@Param() params: vehicleIdDto, @Body() body: updateVehicleDto) {
    const { id } = params;
    const { plate, color, manufacturer } = body;
    const vehicle = await this.vehicleService.updateVehicle({ id, plate, color, manufacturer });
    return vehicle;
  }

  @Delete(':id')
  @ApiOperation({ summary: `Delete a vehicle` })
  @ApiResponse({ status: 203 })
  async deleteVehicle(@Param() params: vehicleIdDto) {
    const { id } = params;
    const response = await this.vehicleService.deleteVehicle(id);
    return response;
  }
}
