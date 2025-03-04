import { Entity, PrimaryGeneratedColumn,Column, Double, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity ('balance')
export class UserBalance{
@PrimaryGeneratedColumn()
id!: number;
@Column('decimal', {precision: 10, scale: 2})
total!: number;

@OneToOne(() => User, (user) => user.balance)
@JoinColumn({name:"userId"})
users!: User;;

@Column()
userId!:number;
}