import { User } from '../entity/User';
import { AppDataSource } from '../../DataSourse';
import { TokenService } from './TokenService';
import { UserProfile } from '../entity/UserProfile';

const userRepository = AppDataSource.getRepository(User);
const profileRepository = AppDataSource.getRepository(UserProfile);

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
    console.log('Начало создания пользователя и профиля');
  
    // Логируем входные данные
    console.log('Входные данные:', JSON.stringify(userData, null, 2));
  
    if (userData.password) {
      console.log('Пароль до хеширования:', JSON.stringify(userData.password));
      console.log('Длина пароля до хеширования:', userData.password.length);
  
      // Хеширование пароля
      userData.password = await TokenService.hashPassword(userData.password);
      console.log('Пароль после хеширования:', userData.password);
      console.log('Длина хеша:', userData.password.length);
    }
  
    // Логируем начало транзакции
    console.log('Начало транзакции');
  
    return AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      try {
        // Логируем создание пользователя
        console.log('Создание пользователя...');
        const user = userRepository.create(userData);
        console.log('Пользователь создан:', JSON.stringify(user, null, 2));
  
        // Сохраняем пользователя
        console.log('Сохранение пользователя в базе данных...');
        await transactionalEntityManager.save(user);
        console.log('Пользователь успешно сохранен. ID пользователя:', user.id);
  
        // Логируем создание профиля
        console.log('Создание профиля...');
        const profileData = {
          name: user.login, // Имя профиля = логин пользователя
          purpose: 'На корм коту и конфеты!', // Цель по умолчанию
          avatar: 'https://i.li.ru/av/704070_274469.jpg', // Аватар по умолчанию
          user: user, // Связь с пользователем
        };
  
        const profile = profileRepository.create(profileData);
        console.log('Профиль создан:', JSON.stringify(profile, null, 2));
  
        // Сохраняем профиль
        console.log('Сохранение профиля в базе данных...');
        await transactionalEntityManager.save(profile);
        console.log('Профиль успешно сохранен. ID профиля:', profile.id);
  
        // Логируем завершение транзакции
        console.log('Транзакция успешно завершена');
  
        // Возвращаем пользователя
        return user;
      } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        console.error('Ошибка в транзакции:', error);
        throw error; // Пробрасываем ошибку дальше
      }
    });
  }
  
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