import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";
import { Request, Response, NextFunction } from 'express'

const userService = new UserService();

export class AuthController {
    static authMiddleware(
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                res.status(401).json({ error: 'Требуется авторизация' });
                return;
            }

            const decoded = TokenService.verifyToken(token) as { Id: number; login: string };
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Недействительный токен' });
        }
    }

    async getUserProfile(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Не авторизован' });
            }

            const userId = req.user.Id;
            const user = await userService.getUserById(userId);
            
            if (user) {
                res.json({
                    id: user.id,
                    login: user.login
                });
            } else {
                res.status(404).json({ error: 'Пользователь не найден' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
    // Валидация пароля
    private validatePassword(password: string): void {
        const errors: string[] = [];
        
        if (password.length < 6) {
            errors.push('Пароль должен содержать минимум 6 символов');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Пароль должен содержать хотя бы одну заглавную букву');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Пароль должен содержать хотя бы одну строчную букву');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }

    // Регистрация пользователя
    async createUser(req: Request, res: Response) {
        try {
            const { login, password, ...rest } = req.body;

            if (!password) {
                return res.status(400).json({ error: 'Пароль обязателен' });
            }

            this.validatePassword(password);

            const existingUser = await userService.fetUserBeLogin(login);
            if (existingUser) {
                return res.status(400).json({ error: 'Логин уже занят' });
            }

            // Хеширование пароля
            const newUser = await userService.createUser({
                login,
                password,
                ...rest
            });

            res.status(201).json(newUser);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Внутренняя ошибка сервера' });
            }
        }
    }

    // Аутентификация пользователя
    async login(req: Request, res: Response) {
        try {
          const { login, password } = req.body;
          console.log('Вход:', { login, password });
          console.log('Пароль в запросе:', JSON.stringify(password)); // Логируем пароль как строку
          console.log('Длина пароля в запросе:', password.length);
      
          const user = await userService.fetUserBeLogin(login);
          if (!user) {
            console.log('Пользователь не найден');
            return res.status(401).json({ error: 'Неверные учетные данные' });
          }
      
          console.log('Пользователь найден:', user);
          console.log('Хешированный пароль в базе:', user.password);
          console.log('Длина хеша в базе:', user.password.length);
      
          const isValid = await TokenService.comparePassword(password, user.password);
          if (!isValid) {
            console.log('Неверный пароль');
            return res.status(401).json({ error: 'Неверные учетные данные' });
          }
      
          const token = TokenService.generateToken(user.id, user.login);
          console.log('Токен сгенерирован:', token);
      
          res.json({
            token,
            user: {
              id: user.id,
              login: user.login
            }
          });
        } catch (error) {
          console.error('Ошибка входа:', error);
          res.status(500).json({ error: 'Ошибка сервера' });
        }
      }

    // Получение данных пользователя (защищенный маршрут)
    async getUserByLogin(req: Request, res: Response) {
        try {
            
            // Проверяем наличие пользователя
            if (!req.user) {
                return res.status(401).json({ error: 'Пользователь не авторизован' });
            }
    
            const userId = req.user.Id; // Теперь безопасный доступ
            const user = await userService.getUserById(userId);
            
            if (user) {
                res.json({
                    id: user.id,
                    login: user.login
                });
            } else {
                res.status(404).json({ message: 'Пользователь не найден' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}