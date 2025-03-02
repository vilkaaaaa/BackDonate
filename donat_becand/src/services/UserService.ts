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
    // Хешируем пароль перед сохранением
    if (userData.password) {
      userData.password = await TokenService.hashPassword(userData.password);
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