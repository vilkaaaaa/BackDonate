import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany } from "typeorm";
import {User} from './User'

@Entity('profile')
export class UserProfile{
@PrimaryGeneratedColumn()
id!: number;

@Column({length:255})
name!: string;
@Column({length:255})
purpose!:string;
@Column({length:255})
avatar!: string;

@Column()
userid!:number;
@OneToMany(()=>User,(user)=>user.profiles)
@JoinColumn({name:'userid'})
user!: User;

}
