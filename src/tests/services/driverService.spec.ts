import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from '../../modules/driver/driver.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../../modules/driver/driver.entity';

describe('DriverService', () => {
  let service: DriverService;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();

    console.log(`MongoDB in-memory server started at ${uri}`);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mongodb',
          url: uri,
          entities: [Driver],
          synchronize: false,
        }),
        TypeOrmModule.forFeature([Driver]),
      ],
      providers: [DriverService],
    }).compile();

    service = module.get<DriverService>(DriverService);
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('Should create a new driver', async () => {
    const driverData = { name: 'Test Driver', isActive: true };
    const createdDriver = await service.createDriver(driverData);
    expect(createdDriver).toHaveProperty('_id');
    expect(createdDriver.name).toBe(driverData.name);
  });

  it('Should list all drivers', async () => {
    const drivers = await service.listAllDrivers({
      orderOption: 'name',
      orderType: 'ASC',
      page: 1,
      itemsPerPage: 10,
      name: '',
    });

    expect(drivers.data).toBeDefined();
    expect(drivers.meta).toMatchObject({
      page: 1,
      itemsPerPage: 10,
      totalPages: expect.any(Number),
    });
  });

  it('Should get a driver by id', async () => {
    const driverData = { name: 'Test Driver', isActive: true };
    const createdDriver = await service.createDriver(driverData);
    const foundDriver = await service.getById(createdDriver._id);
    expect(foundDriver).toBeDefined();
    expect(foundDriver.name).toBe(driverData.name);
  });

  it('Should update a driver', async () => {
    const driverData = { name: 'Driver Test', isActive: true };
    const createdDriver = await service.createDriver(driverData);

    const updatedDriver = await service.updateDriver({
      id: createdDriver._id,
      name: 'Updated Driver Name',
    });

    expect(updatedDriver.name).toBe('Updated Driver Name');
  });

  it('Should delete a driver', async () => {
    const driverData = { name: 'Driver To Delete', isActive: true };
    const createdDriver = await service.createDriver(driverData);

    const deletedDriver = await service.deleteDriver(createdDriver._id);
    expect(deletedDriver.isActive).toBe(false);
    expect(deletedDriver.deleted_at).toBeInstanceOf(Date);
  });
});
