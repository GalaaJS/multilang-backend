import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column()
  created_at: Date;

  @ManyToMany(() => Project, (project) => project.users)
  projects: Project[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 15);
  }
}
