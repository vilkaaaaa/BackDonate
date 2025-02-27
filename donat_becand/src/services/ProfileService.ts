  import { UserProfile } from "../entity/UserProfile";
  import { AppDataSource } from "../../DataSourse";
const profileRepository = AppDataSource.getRepository(UserProfile)
export class ProfileService{ 
  //получение данных о профиле - имя, цель, аватар, баланс, ТРАНЗАКЦИИ
async getProfileId(id:number):Promise<UserProfile| null>{
  return profileRepository.findOne({where:{id}})
}
     //создание профиля - имя, цель, аватар
async createProfile(profileData:Partial<UserProfile>):Promise<UserProfile>{
  const profile = profileRepository.create(profileData);
  return profileRepository.save(profile);
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