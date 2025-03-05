import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export class TokenService {
   static readonly ACCESS_SECRET = 'your-secret-key-here';
   static readonly ACCESS_EXPIRES_IN = '1h';
static readonly REFRESH_SECRET = 'your-secret-key-here';
static readonly REFRESH_EXPIRES_IN = '7d';

  // Генерация токена
  static generateAccessToken(userId: number, login: string): string {
    return jwt.sign(
        { userId, login }, // Важно: используем userId
        this.ACCESS_SECRET,
        { expiresIn: this.ACCESS_EXPIRES_IN }
    );
}
  //генерация решреш токена
  static generateRefreshToken(userId: number, login: string): string {
    return jwt.sign(
      { userId, login },
      this.REFRESH_SECRET,
      { expiresIn: this.REFRESH_EXPIRES_IN }
    );
  }
  //Верификация решреш токена
  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.REFRESH_SECRET);
  }
  // Верификация токена
  static verifyAccessToken(token: string): any {
    return jwt.verify(token, this.ACCESS_SECRET);
  }

  // Хеширование пароля
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Количество раундов хеширования
    return await bcrypt.hash(password, saltRounds);
  }

  // Сравнение пароля с хешем
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    console.log('Сравнение пароля:', JSON.stringify(password), 'с хешем:', hash);
    console.log('Длина пароля:', password.length);
    console.log('Длина хеша:', hash.length);
    const result = await bcrypt.compare(password, hash);
    console.log('Результат сравнения:', result);
    return result;
  }
}
