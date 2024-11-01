import { CreateDateColumn, UpdateDateColumn, Column, ObjectIdColumn, BeforeInsert, BeforeUpdate, DeleteDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export abstract class UniversalEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;

  @Column()
  isActive: boolean;

  @BeforeInsert()
  setDefaults() {
    this._id = new ObjectId();
    this.created_at = new Date();
    this.updated_at = new Date();
    this.isActive = true;
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
