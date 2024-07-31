import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from './user.entity';

@Entity()
export class URL {
  @PrimaryColumn({ length: 5 })
  url_id: string;

  @Column('text')
  url: string;

  @Column('text')
  description: string;

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

  @BeforeInsert()
  async generateUrlId() {
    const latest = await AppDataSource.getRepository(URL).find({
      order: { url_id: 'DESC' },
      take: 1,
    });

    if (latest.length === 0) {
      this.url_id = '00001';
    } else {
      const latestId = parseInt(latest[0].url_id, 10);
      const newId = (latestId + 1).toString().padStart(5, '0');
      this.url_id = newId;
    }
  }
}
