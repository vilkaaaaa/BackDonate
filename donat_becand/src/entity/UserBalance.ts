import { Entity, PrimaryGeneratedColumn,Column, Double, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity ('balance')
export class UserBalance{
@PrimaryGeneratedColumn()
id!: number;
@Column()
total!: number

@OneToOne(() => User, (user) => user.balance)
@JoinColumn()
userId!: User;;

@Column()
users!:number;
}