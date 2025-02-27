import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, Transaction } from 'typeorm';
import { UserProfile } from './UserProfile';
import { UserBalance } from './UserBalance';
import { Transactions } from './Transactions';
@Entity('users') 
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 225})
  login!: string;

  @Column({length : 225})
  password!: string;
@OneToMany(()=>UserProfile, (profile)=>profile.userid)
profiles!: UserProfile;

@OneToOne(()=>UserBalance, (balance)=>balance.users)
balances!:UserBalance;

@OneToMany(()=>Transactions, (transaction)=>transaction.sender)
transactionses!:Transactions;
}