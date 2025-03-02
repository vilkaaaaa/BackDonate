import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class TokenService {
  private static readonly SECRET_KEY = 'your-secret-key-here';
  private static readonly EXPIRES_IN = '1h';

  // Генерация токена
  static generateToken(userId: number, login: string): string {
    return jwt.sign(
      { userId, login },
      this.SECRET_KEY,
      { expiresIn: this.EXPIRES_IN }
    );
  }

  // Верификация токена
  static verifyToken(token: string): any {
    return jwt.verify(token, this.SECRET_KEY);
  }

  // Хеширование пароля
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Сравнение пароля с хешем
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}