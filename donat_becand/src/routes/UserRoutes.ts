import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();
const userController = new UserController();

// Получить пользователя по ID
router.get('/users/:id', (req, res) => userController.getUserById(req, res));

// Создать пользователя
router.post('/users', (req, res) => userController.createUser(req, res));

// Обновить пользователя
router.put('/users/:id', (req, res) => userController.updateUser(req, res));

// Удалить пользователя
router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));

// Получить всех пользователей
router.get('/users', (req, res) => userController.getAllUsers(req, res));

export default router;