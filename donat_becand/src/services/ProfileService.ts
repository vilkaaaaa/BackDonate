  import { UserProfile } from "../entity/UserProfile";
  import { AppDataSource } from "../../DataSourse";
  import { User } from "../entity/User";
const profileRepository = AppDataSource.getRepository(UserProfile);
const userRepository = AppDataSource.getRepository(User);
export class ProfileService{ 
//получение всх профилей 
async getAllProfile ():Promise<UserProfile[]>{
  return profileRepository.find();
}
  //получение данных о профиле - имя, цель, аватар, баланс, ТРАНЗАКЦИи. Получение через id пользователя(user)
  async getProfileByUserId(userId: number): Promise<UserProfile | null> {
    try {
      console.log('Поиск профиля для пользователя с ID:', userId);
  
      // Находим пользователя по ID
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        console.error('Пользователь не найден для ID:', userId);
        return null;
      }
  
      console.log('Пользователь найден:', user);
  
      // Находим профиль по userid
      const profile = await profileRepository.findOne({ where: { userid: userId } });
      if (!profile) {
        console.error('Профиль не найден для пользователя с ID:', userId);
        return null;
      }
  
      console.log('Профиль найден:', profile);
      return profile;
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      throw error;
    }
  }

      //изменение данных - имя, цель, аватар
      async updateProfile (userId: number, userData: Partial<UserProfile>):Promise<UserProfile | null>{
        await profileRepository.update(userId, userData);
        return this.getProfileByUserId(userId);
      }
      //удвлить пользователя
      async deletProfile(id:number): Promise<void>{
        await profileRepository.delete(id);
      }
}