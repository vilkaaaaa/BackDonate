import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
@Entity('transaction')
export class UserTransaction{
@PrimaryGeneratedColumn()
id!: number;

@ManyToOne(() => User, (user) => user.senderTransactions)
@JoinColumn({ name: 'sender' })
senderId!: User;

@Column()
sender!: number;  // Внешний ключ для отправителя

// Связь с получателем (User)
@ManyToOne(() => User, (user) => user.recipientTransactions)
@JoinColumn({ name: 'recipient' })
recipientId!: User;

@Column()
recipient!: number;  // Внешний ключ для получателя

@Column('decimal', { precision: 10, scale: 2 })
amount!: number;  // Сумма перевода

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
createdAt!: Date;  // Время создания транзакции

@Column({length:255})
massage!:string;
}