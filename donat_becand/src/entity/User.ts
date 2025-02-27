import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
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

@OneToOne(()=>UserBalance, (balance)=>balance.users)
balances!:UserBalance;

@OneToMany(()=> UserTransaction, (transaction)=>transaction.sender)
transactions!:UserTransaction;

@OneToMany(()=>UserTransaction, (transaction)=>transaction.resipient)
transactions1!:UserTransaction;
}