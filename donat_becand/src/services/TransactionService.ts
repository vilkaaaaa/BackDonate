import { AppDataSource } from "../../DataSourse";
import { UserTransaction } from "../entity/UserTransaction";
import { User } from "../entity/User";
import { UserBalance } from "../entity/UserBalance";
const userRepository = AppDataSource.getRepository(User);
const transactionRepository = AppDataSource.getRepository(UserTransaction);
const userBalanceRepository = AppDataSource.getRepository(UserBalance);

export class TransactionService {
  // Перевод денег
  static async transferMoney(senderId: number, recipientId: number, amount: number, massage: string) {
    const queryRunner = AppDataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Получаем отправителя и получателя
      const sender = await queryRunner.manager.findOne(User, {
        where: { id: senderId },
        relations: ["balance"], // Подгружаем баланс отправителя
      });
      const recipient = await queryRunner.manager.findOne(User, {
        where: { id: recipientId },
        relations: ["balance"], // Подгружаем баланс получателя
      });

      if (!sender || !recipient) {
        throw new Error("Отправитель или получатель не найден");
      }

      // Проверяем, что у отправителя достаточно средств
      if (sender.balance.total < amount) {
        throw new Error("Недостаточно средств на балансе отправителя");
      }

      // Проверяем, что сумма перевода положительная
      if (amount <= 0) {
        throw new Error("Сумма перевода должна быть больше нуля");
      }

      // Вычитаем сумму у отправителя
      sender.balance.total -= amount;
      await queryRunner.manager.save(sender.balance);

      // Добавляем сумму получателю
      recipient.balance.total += amount;
      await queryRunner.manager.save(recipient.balance);

      // Создаем транзакцию
      const transaction = new UserTransaction();
      transaction.senderId = sender;
      transaction.recipientId = recipient;
      transaction.amount = amount;
      transaction.massage = massage;

      await queryRunner.manager.save(transaction);

      // Фиксируем транзакцию
      await queryRunner.commitTransaction();

      return transaction;
    } catch (error) {
      // Откатываем транзакцию в случае ошибки
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Освобождаем QueryRunner
      await queryRunner.release();
    }
  }

  // Получить все транзакции пользователя
  static async getUserTransactions(userId: number) {
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["senderTransactions", "recipientTransactions"], // Подгружаем транзакции
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    return {
      sentTransactions: user.senderTransactions,
      receivedTransactions: user.recipientTransactions,
    };
  }

  // Получить текущий баланс пользователя
  static async getUserBalance(userId: number) {
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["balance"], // Подгружаем баланс
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    return user.balance.total;
  }
}
