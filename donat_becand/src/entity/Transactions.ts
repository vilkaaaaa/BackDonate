import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
@Entity('transaction')
export class Transactions{
@PrimaryGeneratedColumn()
id!: number;

@OneToMany(()=>User, (user)=>user.transactionses)
@JoinColumn({name:'sender'})
user!:User;

@Column()
sender!: number;
}