import express from 'express';
import { TransactionController } from '../controllers/transactionController';
const router = express.Router();

// Перевод денег (POST)
router.post('/transactions/transfer', TransactionController.transferMoney);

// Получить транзакции пользователя (GET)
router.get('/transactions/:userId', TransactionController.getUserTransactions);

// Получить баланс пользователя (GET)
router.get('/balance/:userId', TransactionController.getUserBalance);

export default router;