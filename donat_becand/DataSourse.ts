import { DataSource } from 'typeorm';
import { User } from './src/entity/User';
import { UserProfile } from './src/entity/UserProfile';
import { UserBalance } from './src/entity/UserBalance';
import { Transactions } from './src/entity/Transactions';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1',
  database: 'postgres',
  entities: [User, UserProfile, UserBalance, Transactions],  // Подключите ваши сущности
  synchronize: true, // Только для разработки!
});