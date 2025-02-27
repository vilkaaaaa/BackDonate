import { AppDataSource } from "../../DataSourse";
import { UserTransaction } from "../entity/UserTransaction";
const transactionRepository = AppDataSource.getRepository(UserTransaction);
export class TransactionService{

        //вычет суммы перевода из баланса
         //пополнение суммы баланса
          //подсчет суммы перевода и сохранение в базу
}