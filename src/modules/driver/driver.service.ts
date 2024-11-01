import { NotFoundException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Driver } from './driver.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverEntity: MongoRepository<Driver>,
  ) {}

  async listAllDrivers({ orderOption, orderType, page, itemsPerPage, name }) {
    const skip = itemsPerPage * (page - 1);
    const filter: Record<string, any> = { isActive: true };
    if (name) {
      filter['name'] = { $regex: new RegExp(name, 'i') };
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
    const vehicles = await this.driverEntity.aggregate(pipeline).toArray();
    const totalItems = await this.driverEntity.countDocuments(filter);

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

  getById(id): Promise<Driver> {
    return this.driverEntity.findOneBy({ _id: new ObjectId(id) });
  }

  async driverExists(id): Promise<boolean> {
    const driver = await this.driverEntity.findOne({ where: { _id: new ObjectId(id) }, select: ['_id'] });
    return !!driver;
  }

  createDriver(driver): Promise<any> {
    return this.driverEntity.save(this.driverEntity.create(driver));
  }

  async updateDriver({ id, name }): Promise<Driver> {
    const driver = await this.driverEntity.findOneBy({ _id: new ObjectId(id) });
    if (!driver) throw new NotFoundException('Driver not found');

    driver.name = name || driver.name;

    return this.driverEntity.save(driver);
  }

  async deleteDriver(id): Promise<Driver> {
    const driver = await this.driverEntity.findOneBy({
      _id: new ObjectId(id),
    });
    if (!driver) throw new NotFoundException('Could not find driver');
    driver.isActive = false;
    driver.deleted_at = new Date();
    return this.driverEntity.save(driver);
  }
}
