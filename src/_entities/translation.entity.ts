import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from './user.entity';

@Entity()
export class Translation {
  @PrimaryColumn({ length: 5 })
  translation_id: string;

  @Column('text')
  str_english: string;

  @Column('text', { nullable: true })
  str_french: string;

  @Column('text', { nullable: true })
  str_spanish: string;

  @Column('text', { nullable: true })
  urls: string;

  @Column('text', { nullable: true })
  project_ids: string;

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

  @Column('json', { nullable: true })
  history: any;

  @Column({ default: true })
  is_active: boolean;

  @BeforeInsert()
  async generateTranslationId() {
    const latest = await AppDataSource.getRepository(Translation)
      .createQueryBuilder('t')
      .select('t.translation_id')
      .orderBy(
        "CAST(SUBSTRING(t.translation_id FROM '[0-9]+') AS INTEGER)",
        'DESC'
      )
      .limit(1)
      .getOne();

    if (latest) {
      const latestId = parseInt(latest.translation_id.split('_')[1], 10);
      this.translation_id = `S_${latestId + 1}`;
    } else {
      this.translation_id = 'S_1';
    }
  }
}
