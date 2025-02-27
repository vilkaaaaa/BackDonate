import { AppDataSource } from "../../DataSourse";
import { UserBalance } from "../entity/UserBalance";
const balanceRepository = AppDataSource.getRepository(UserBalance);