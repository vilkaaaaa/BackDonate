import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";
import { ProfileService } from "../services/ProfileService";
import { Request, Response, NextFunction } from 'express'

const userService = new UserService();
const profileService = new ProfileService;

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
            
            // Используем verifyAccessToken и правильный тип
            const decoded = TokenService.verifyAccessToken(token) as { userId: number; login: string };
            req.user = decoded; // Теперь используется userId вместо Id
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

            // Исправлено на userId
            const userId = req.user.userId;
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

    // Регистрация пользователя и создание профиля
    async createUser(req: Request, res: Response) {
        try {
            const { login, password, ...rest } = req.body;

            if (!password) {
                return res.status(400).json({ error: 'Пароль обязатеKsлен' });
            }

            this.validatePassword(password);

            const existingUser = await userService.getUserBeLogin(login);
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

//рефреш токен до 7 дней
async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Требуется авторизация' });
      }
  
      // Валидация Refresh Token
      const userData = TokenService.verifyRefreshToken(refreshToken);
      if (!userData) {
        return res.status(401).json({ error: 'Недействительный токен' });
      }
  
      // Проверка существования пользователя
      const user = await userService.getUserById(userData.userId);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
  
      // Генерация новых токенов
      const newAccessToken = TokenService.generateAccessToken(user.id, user.login);
      const newRefreshToken = TokenService.generateRefreshToken(user.id, user.login);
  
      // Обновление куки
      res.cookie('refreshToken', newRefreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });
  
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  //Выход
  async logout(req: Request, res: Response) {
    try {
      res.clearCookie('refreshToken');
      res.json({ message: 'Выход выполнен успешно' });
    } catch (error) {
      console.error('Ошибка выхода:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

    // Аутентификация пользователя
    async login(req: Request, res: Response) {
        try {
          const { login, password } = req.body;
          
          const user = await userService.getUserBeLogin(login);
          if (!user || !(await TokenService.comparePassword(password, user.password))) {
            return res.status(401).json({ error: 'Неверные учетные данные' });
          }
      
          // Генерация токенов
          const accessToken = TokenService.generateAccessToken(user.id, user.login);
          const refreshToken = TokenService.generateRefreshToken(user.id, user.login);
      
          // Установка Refresh Token в куки
          res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
            httpOnly: true,
            secure: true, // Для HTTPS
            sameSite: 'strict'
          });
      
          res.json({
            accessToken,
            user: { id: user.id, login: user.login }
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
    
            const userId = req.user.userId; // Теперь безопасный доступ
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