import { Entity, Column, Index } from 'typeorm';
import { UniversalEntity } from '../../entities/universal.entity';

@Entity({ name: 'vehicle' })
@Index(['plate'], { unique: true })
export class Vehicle extends UniversalEntity {
  @Column({ type: 'varchar', unique: true })
  plate: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar' })
  manufacturer: string;
}
