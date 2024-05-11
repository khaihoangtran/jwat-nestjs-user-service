import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user.roles';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'full_name', type: 'varchar', length: 50 })
  fullName: string;

  @Column({ name: 'user_name', type: 'varchar', length: 50 })
  userName: string;

  @Column({ name: 'email', type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
