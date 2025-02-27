import { AppDataSource } from "../../DataSourse";
import{ User} from '../entity/User';
const userRepository = AppDataSource.getRepository(User);