import { NotFoundException, Injectable, ConflictException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { VehicleAssignment } from './vehicleAssignment.entity';

@Injectable()
export class VehicleAssignmentService {
  constructor(
    @InjectRepository(VehicleAssignment)
    private readonly vehicleAssignmentEntity: MongoRepository<VehicleAssignment>,
  ) {}

  async listAllVehicleAssignments({ orderOption, orderType, page, itemsPerPage, driver, plate }) {
    const skip = itemsPerPage * (page - 1);
    const filter: Record<string, any> = { isActive: true };
    const driverFilter = {};
    const vehicleFilter = {};
    if (orderOption === 'driver') orderOption = 'driverData.name';
    if (orderOption === 'vehicle') orderOption = 'vehicleData.plate';
    if (driver) {
      driverFilter['name'] = { $regex: new RegExp(driver, 'i') };
    }
    if (plate) {
      vehicleFilter['plate'] = { $regex: new RegExp(plate, 'i') };
    }
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'driver',
          localField: 'driver_id',
          foreignField: '_id',
          as: 'driverData',
          pipeline: [{ $match: driverFilter }],
        },
      },
      { $unwind: { path: '$driverData' } },
      {
        $lookup: {
          from: 'vehicle',
          localField: 'vehicle_id',
          foreignField: '_id',
          as: 'vehicleData',
          pipeline: [{ $match: vehicleFilter }],
        },
      },
      { $unwind: { path: '$vehicleData' } },
      {
        $facet: {
          vehiclesAssignments: [
            { $skip: skip },
            { $limit: itemsPerPage },
            {
              $sort: {
                [orderOption]: orderType == 'ASC' ? 1 : -1,
              },
            },
          ],
          totalItems: [{ $count: 'totalItems' }],
        },
      },
    ];
    const aggregationResult = await this.vehicleAssignmentEntity.aggregate(pipeline).toArray();
    console.log(aggregationResult);
    const vehiclesAssignments = (aggregationResult[0] as any).vehiclesAssignments;
    const totalItems = (aggregationResult[0] as any).totalItems[0].totalItems;

    const response = {
      data: { vehiclesAssignments },
      meta: {
        page,
        itemsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
    };

    return response;
  }

  async getById(id): Promise<VehicleAssignment> {
    const pipeline = [
      {
        $lookup: {
          from: 'driver',
          localField: 'driver_id',
          foreignField: '_id',
          as: 'driverData',
        },
      },
      { $unwind: { path: '$driverData' } },
      {
        $lookup: {
          from: 'vehicle',
          localField: 'vehicle_id',
          foreignField: '_id',
          as: 'vehicleData',
        },
      },
      { $unwind: { path: '$vehicleData' } },
      { $match: { _id: new ObjectId(id) } },
    ];

    const vehicleAssignment = await this.vehicleAssignmentEntity.aggregate(pipeline).next();
    console.log(vehicleAssignment);
    if (!vehicleAssignment) throw new NotFoundException('Could not find vehicle assignment');
    return vehicleAssignment;
  }

  async createVehicleAssignment({ vehicle_id, driver_id, reason }): Promise<VehicleAssignment> {
    const isAssigned = await this.vehicleAssignmentEntity.findOne({
      where: {
        $or: [{ vehicle_id: new ObjectId(vehicle_id) }, { driver_id: new ObjectId(driver_id) }],
        ended_at: null,
      },
    });
    if (isAssigned && isAssigned.driver_id.equals(new ObjectId(driver_id))) throw new ConflictException('Driver is already assigned to a vehicle');
    if (isAssigned && isAssigned.vehicle_id.equals(new ObjectId(vehicle_id))) throw new ConflictException('Vehicle is already assigned to a driver');

    const vehicleAssignment = {
      vehicle_id: new ObjectId(vehicle_id),
      driver_id: new ObjectId(driver_id),
      started_at: new Date(),
      ended_at: null,
      reason,
    };
    return this.vehicleAssignmentEntity.save(this.vehicleAssignmentEntity.create(vehicleAssignment));
  }

  async createVehicleUnassignment(id): Promise<VehicleAssignment> {
    const vehicleAssignment = await this.vehicleAssignmentEntity.findOneBy({
      _id: new ObjectId(id),
    });
    if (!vehicleAssignment) throw new NotFoundException('Could not find vehicle assignment');
    if (vehicleAssignment.ended_at) throw new ConflictException('Assignment already ended');

    vehicleAssignment.ended_at = new Date();

    return this.vehicleAssignmentEntity.save(vehicleAssignment);
  }
}
