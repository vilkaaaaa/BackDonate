  import { UserProfile } from "../entity/UserProfile";
  import { AppDataSource } from "../../DataSourse";
  import { User } from "../entity/User";
const profileRepository = AppDataSource.getRepository(UserProfile);
const userRepository = AppDataSource.getRepository(UserProfile);
export class ProfileService{ 
  //получение данных о профиле - имя, цель, аватар, баланс, ТРАНЗАКЦИИ
async getProfileId(id:number):Promise<UserProfile| null>{
  return profileRepository.findOne({where:{id}})
}  
      //изменение данных - имя, цель, аватар
      async updateProfile (id: number, userData: Partial<UserProfile>):Promise<UserProfile | null>{
        await profileRepository.update(id, userData);
        return this.getProfileId(id);
      }
      //удвлить пользователя
      async deletProfile(id:number): Promise<void>{
        await profileRepository.delete(id);
      }
}