import { AppDataSource } from "../../DataSourse";
import { UserProfile } from "../entity/UserProfile";
const profileRepository = AppDataSource.getRepository(UserProfile);