import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  // Получить пользователя по ID
  async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const user = await userService.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Пользователь не найдет' });
    }
  }

  // Создать пользователя
  async createUser(req: Request, res: Response) {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  }

  // Обновить пользователя
  async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    const userData = req.body;
    const updatedUser = await userService.updateUser(userId, userData);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  }

  // Удалить пользователя
  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);
    await userService.deleteUser(userId);
    res.status(204).send();
  }

  // Получить всех пользователей
  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.json(users);
  }
}