import { NotFoundException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleEntity: MongoRepository<Vehicle>,
  ) {}

  async listAllVehicles({ searchKey, orderOption, orderType, page, itemsPerPage, color, manufacturer }) {
    const skip = itemsPerPage * (page - 1);
    const filter: Record<string, any> = { isActive: true };
    if (searchKey) {
      filter['$or'] = [
        { plate: { $regex: new RegExp(searchKey, 'i') } },
        { color: { $regex: new RegExp(searchKey, 'i') } },
        { manufacturer: { $regex: new RegExp(searchKey, 'i') } },
      ];
    }
    if (color) {
      filter['color'] = { $regex: new RegExp(color, 'i') };
    }
    if (manufacturer) {
      filter['manufacturer'] = { $regex: new RegExp(manufacturer, 'i') };
    }
    const pipeline = [
      { $match: filter },
      { $skip: skip },
      { $limit: itemsPerPage },
      {
        $sort: {
          [orderOption]: orderType === 'ASC' ? 1 : -1,
        },
      },
    ];
    const vehicles = await this.vehicleEntity.aggregate(pipeline).toArray();
    const totalItems = await this.vehicleEntity.countDocuments(filter);

    const response = {
      data: { vehicles },
      meta: {
        page,
        itemsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
    };

    return response;
  }

  getById(id): Promise<Vehicle> {
    return this.vehicleEntity.findOneBy({ _id: new ObjectId(id) });
  }

  async vehicleExists(id): Promise<boolean> {
    const vehicle = await this.vehicleEntity.findOne({ where: { _id: new ObjectId(id) }, select: ['_id'] });
    return !!vehicle;
  }

  getByPlate(plate): Promise<Vehicle> {
    return this.vehicleEntity.findOne({ where: { plate: plate } });
  }

  createVehicle(vehicle): Promise<any> {
    return this.vehicleEntity.save(this.vehicleEntity.create(vehicle));
  }

  async updateVehicle({ id, plate, color, manufacturer }): Promise<Vehicle> {
    const vehicle = await this.vehicleEntity.findOneBy({
      _id: new ObjectId(id),
    });
    if (!vehicle) throw new NotFoundException('Could not find vehicle');

    vehicle.plate = plate || vehicle.plate;
    vehicle.color = color || vehicle.color;
    vehicle.manufacturer = manufacturer || vehicle.manufacturer;

    return this.vehicleEntity.save(vehicle);
  }

  async deleteVehicle(id): Promise<Vehicle> {
    const vehicle = await this.vehicleEntity.findOneBy({
      _id: new ObjectId(id),
    });
    if (!vehicle) throw new NotFoundException('Could not find vehicle');
    vehicle.isActive = false;
    vehicle.deleted_at = new Date();
    return this.vehicleEntity.save(vehicle);
  }
}
