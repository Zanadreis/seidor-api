import { Entity, Column } from 'typeorm';
import { UniversalEntity } from '../../entities/universal.entity';
import { ObjectId } from 'mongodb';

@Entity({ name: 'vehicleAssignment' })
export class VehicleAssignment extends UniversalEntity {
  @Column({ type: 'varchar' })
  vehicle_id: ObjectId;

  @Column({ type: 'varchar' })
  driver_id: ObjectId;

  @Column({ type: 'timestamp' })
  started_at: Date;

  @Column({ type: 'timestamp' })
  ended_at: Date;

  @Column({ type: 'varchar' })
  reason: string;
}
