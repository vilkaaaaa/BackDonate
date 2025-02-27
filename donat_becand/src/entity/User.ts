import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { UserProfile } from './UserProfile';
import { UserBalance } from './UserBalance';
import { UserTransaction } from './UserTransaction';
@Entity('users') 
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 225})
  login!: string;

  @Column({length : 225})
  password!: string;
@OneToOne(()=>UserProfile, (profile)=>profile.userid)
profiles!: UserProfile;
@OneToOne(() => UserBalance, (balance) => balance.users)
balance!: UserBalance;

@OneToMany(() => UserTransaction, (transaction) => transaction.sender)
senderTransactions!: UserTransaction[];

@OneToMany(() => UserTransaction, (transaction) => transaction.recipient)
recipientTransactions!: UserTransaction[];
}