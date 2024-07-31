import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserConnected {
  @PrimaryColumn()
  user_id: number;

  @Column({ unique: true })
  token: string;

  @Column()
  lastConnected: Date;
}
