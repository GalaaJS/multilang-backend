import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from './user.entity';

@Entity()
export class Project {
  @PrimaryColumn({ length: 4 })
  project_id: string;

  @Column({ nullable: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ length: 200, nullable: true })
  languages: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @Column()
  updated_at: Date;

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable()
  users: User[];

  @BeforeInsert()
  async generateProjectId() {
    const latestProject = await AppDataSource.getRepository(Project).find({
      order: { project_id: 'DESC' },
      take: 1,
    });

    if (latestProject.length === 0) {
      this.project_id = '0001';
    } else {
      const latestId = parseInt(latestProject[0].project_id, 10);
      const newId = (latestId + 1).toString().padStart(4, '0');
      this.project_id = newId;
    }
  }
}
