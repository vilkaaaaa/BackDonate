import { UserProfile } from "../entity/UserProfile";
import { AppDataSource } from "../../DataSourse";
const profileRepository = AppDataSource.getRepository(UserProfile);