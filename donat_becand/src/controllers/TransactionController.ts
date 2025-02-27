import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';

export class TransactionController {
  // Перевод денег
  static async transferMoney(req: Request, res: Response) {
    try {
      const { senderId, recipientId, amount } = req.body;
      const transaction = await TransactionService.transferMoney(senderId, recipientId, amount);
      res.status(201).json(transaction);
    } catch (error) {
      // Проверяем, что error является объектом Error
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Неизвестная ошибка' });
      }
    }
  }

  // Получить все транзакции пользователя
  static async getUserTransactions(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const transactions = await TransactionService.getUserTransactions(userId);
      res.status(200).json(transactions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(404).json({ error: 'Неизвестная ошибка' });
      }
    }
  }

  // Получить баланс пользователя
  static async getUserBalance(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const balance = await TransactionService.getUserBalance(userId);
      res.status(200).json({ balance });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(404).json({ error: 'Неизвестная ошибка' });
      }
    }
  }
}