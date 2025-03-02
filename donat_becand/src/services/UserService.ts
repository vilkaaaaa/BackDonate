import { User } from '../entity/User';
import { AppDataSource } from '../../DataSourse';
import { TokenService } from './TokenService';

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  // Получить пользователя по ID
  async getUserById(id: number): Promise<User | null> {
    return userRepository.findOne({ where: { id } });
  }
  //Получить пользователя по логину
  async fetUserBeLogin(login: string):Promise<User | null>{
return userRepository.findOne({where:{login}});
  }

  async createUser(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      console.log('Пароль до хеширования:', JSON.stringify(userData.password)); // Логируем пароль как строку
      console.log('Длина пароля до хеширования:', userData.password.length);
      userData.password = await TokenService.hashPassword(userData.password);
      console.log('Пароль после хеширования:', userData.password);
      console.log('Длина хеша:', userData.password.length);
    }
    const user = userRepository.create(userData);
    return userRepository.save(user);
  }
  
  // // Создать пользователя
  // async createUser(userData: Partial<User>): Promise<User> {
  //   const user = userRepository.create(userData);
  //   return userRepository.save(user);
  // }

  // Обновить пользователя
  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    await userRepository.update(id, userData);
    return this.getUserById(id);
  }

  // Удалить пользователя
  async deleteUser(id: number): Promise<void> {
    await userRepository.delete(id);
  }

  // Получить всех пользователей
  async getAllUsers(): Promise<User[]> {
    return userRepository.find();
  }
}