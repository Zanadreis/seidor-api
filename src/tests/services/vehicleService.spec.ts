import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from '../../modules/vehicle/vehicle.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../../modules/vehicle/vehicle.entity';

describe('VehicleService', () => {
  let service: VehicleService;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mongodb',
          url: uri,
          entities: [Vehicle],
          synchronize: false,
        }),
        TypeOrmModule.forFeature([Vehicle]),
      ],
      providers: [VehicleService],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('Should create a new vehicle', async () => {
    const vehicleData = { plate: 'AAA1111', color: 'white', manufacturer: 'Hyunday', isActive: true };
    const createdVehicle = await service.createVehicle(vehicleData);
    expect(createdVehicle).toHaveProperty('_id');
    expect(createdVehicle.plate).toBe(vehicleData.plate);
  });

  it('Should list all vehicles', async () => {
    await service.createVehicle({ plate: 'BBB2222', color: 'black', manufacturer: 'BMW', isActive: true });
    await service.createVehicle({ plate: 'CCC3333', color: 'blue', manufacturer: 'Ford', isActive: true });

    const vehicles = await service.listAllVehicles({
      searchKey: '',
      orderOption: 'plate',
      orderType: 'ASC',
      page: 1,
      itemsPerPage: 10,
      color: '',
      manufacturer: '',
    });

    expect(vehicles.data).toBeDefined();
    expect(vehicles.meta).toMatchObject({
      page: 1,
      itemsPerPage: 10,
      totalPages: expect.any(Number),
    });
  });

  it('Should get a vehicle by id', async () => {
    const vehicleData = { plate: 'DDD4444', color: 'yellow', manufacturer: 'Chevrolet', isActive: true };
    const createdVehicle = await service.createVehicle(vehicleData);
    const foundVehicle = await service.getById(createdVehicle._id);
    expect(foundVehicle).toBeDefined();
    expect(foundVehicle.plate).toBe(vehicleData.plate);
  });

  it('Should update a vehicle', async () => {
    const vehicleData = { plate: 'EEE5555', color: 'red', manufacturer: 'Ferrari', isActive: true };
    const createdVehicle = await service.createVehicle(vehicleData);

    const updatedVehicle = await service.updateVehicle({
      id: createdVehicle._id,
      plate: 'FFF6666',
      color: 'orange',
      manufacturer: 'Porche',
    });

    expect(updatedVehicle.plate).toBe('FFF6666');
    expect(updatedVehicle.color).toBe('orange');
    expect(updatedVehicle.manufacturer).toBe('Porche');
  });

  it('Should delete a vehicle', async () => {
    const vehicleData = { plate: 'GGG7777', color: 'silver', manufacturer: 'VW', isActive: true };
    const createdVehicle = await service.createVehicle(vehicleData);

    const deletedVehicle = await service.deleteVehicle(createdVehicle._id);
    expect(deletedVehicle.isActive).toBe(false);
    expect(deletedVehicle.deleted_at).toBeInstanceOf(Date);
  });
});
