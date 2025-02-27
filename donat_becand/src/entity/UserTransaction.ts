import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
@Entity('transaction')
export class UserTransaction{
@PrimaryGeneratedColumn()
id!: number;

@OneToMany(()=>User, (user)=>user.transactions)
@JoinColumn({name:'sender'})
user!:User;
@Column()
sender!: number;
@OneToMany(()=>User, (user1)=>user1.transactions1)
@JoinColumn({name:'resipient'})
user1!:User;
@Column()
resipient!:number;
}