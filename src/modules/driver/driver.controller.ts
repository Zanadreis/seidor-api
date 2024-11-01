import { Body, Param, Controller, Get, Post, Put, BadRequestException, NotFoundException, Query, Delete } from '@nestjs/common';
import { DriverService } from './driver.service';
import { createDriverDto, driverIdDto, editDriverDto, searchKeysDto } from './driver.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { driverSwagger } from '../../swagger/driver.swagger';

@Controller('driver')
@ApiTags('Driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}
  @Get()
  @ApiOperation({ summary: `Lists all or filter drivers` })
  @ApiResponse({ status: 200, type: driverSwagger, isArray: true })
  async listAllDrivers(@Query() query: searchKeysDto) {
    const { orderOption, orderType, page, itemsPerPage, name } = query;
    const driver = this.driverService.listAllDrivers({ orderOption, orderType, page, itemsPerPage, name });
    if (!driver) throw new BadRequestException('Ops! Something went wrong');
    return driver;
  }

  @Get(':id')
  @ApiOperation({ summary: `List a drivers by it's Id` })
  @ApiResponse({ status: 200, type: driverSwagger })
  async getOneDriver(@Param() params: driverIdDto) {
    const { id } = params;
    const driver = await this.driverService.getById(id);
    if (!driver) throw new NotFoundException('Driver not found');
    return driver;
  }

  @Post()
  @ApiOperation({ summary: `Create a new driver` })
  @ApiResponse({ status: 201, type: driverSwagger })
  async createDriver(@Body() body: createDriverDto) {
    const { name } = body;
    const driver = this.driverService.createDriver({ name });
    if (!driver) throw new BadRequestException('Ops! Something went wrong');
    return driver;
  }

  @Put(':id')
  @ApiOperation({ summary: `Update a driver` })
  @ApiResponse({ status: 201, type: driverSwagger })
  async updateDriver(@Param() params: driverIdDto, @Body() body: editDriverDto) {
    const { id } = params;
    const { name } = body;
    const driver = await this.driverService.updateDriver({ id, name });
    return driver;
  }

  @Delete(':id')
  @ApiOperation({ summary: `Delete a driver` })
  @ApiResponse({ status: 203 })
  async deleteDriver(@Param() params: driverIdDto) {
    const { id } = params;
    const response = await this.driverService.deleteDriver(id);
    return response;
  }
}
