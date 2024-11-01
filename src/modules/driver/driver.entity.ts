import { Entity, Column } from 'typeorm';
import { UniversalEntity } from '../../entities/universal.entity';

@Entity()
export class Driver extends UniversalEntity {
  @Column()
  name: string;
}
