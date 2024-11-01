import { Test, TestingModule } from '@nestjs/testing';
import { VehicleAssignmentService } from '../../modules/vehicleAssignment/vehicleAssignment.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleAssignment } from '../../modules/vehicleAssignment/vehicleAssignment.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

describe('VehicleAssignmentService', () => {
  let service: VehicleAssignmentService;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mongodb',
          url: uri,
          entities: [VehicleAssignment],
          synchronize: false,
        }),
        TypeOrmModule.forFeature([VehicleAssignment]),
      ],
      providers: [VehicleAssignmentService],
    }).compile();

    service = module.get<VehicleAssignmentService>(VehicleAssignmentService);
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const connection = await service['vehicleAssignmentEntity'].manager.connection;
    const vehicleAssignmentRepository = connection.getMongoRepository(VehicleAssignment);
    await vehicleAssignmentRepository.clear();
  });

  it('Should create a new vehicle assignment', async () => {
    const vehicleAssignmentData = {
      vehicle_id: new ObjectId(),
      driver_id: new ObjectId(),
      reason: 'Test assignment',
    };

    const createdAssignment = await service.createVehicleAssignment(vehicleAssignmentData);
    expect(createdAssignment).toHaveProperty('_id');
    expect(createdAssignment.driver_id).toBeDefined();
  });

  it('Should throw a conflict exception if vehicle is already assigned', async () => {
    const vehicleId = new ObjectId();
    const driverId = new ObjectId();
    const vehicleAssignmentData = { vehicle_id: vehicleId, driver_id: driverId, reason: 'Test assignment' };

    await service.createVehicleAssignment(vehicleAssignmentData);
    await expect(service.createVehicleAssignment(vehicleAssignmentData)).rejects.toThrow(ConflictException);
  });

  it('Should throw not found exception if assignment does not exist', async () => {
    await expect(service.getById(new ObjectId())).rejects.toThrow(NotFoundException);
  });

  it('Should create a vehicle unassignment', async () => {
    const vehicleAssignmentData = { vehicle_id: new ObjectId(), driver_id: new ObjectId(), reason: 'Test assignment' };
    const createdAssignment = await service.createVehicleAssignment(vehicleAssignmentData);

    const unassignedAssignment = await service.createVehicleUnassignment(createdAssignment._id);
    expect(unassignedAssignment.ended_at).toBeInstanceOf(Date);
  });

  it('Should throw not found exception when trying to unassign a non-existing assignment', async () => {
    await expect(service.createVehicleUnassignment(new ObjectId())).rejects.toThrow(NotFoundException);
  });
});
