import { User } from '../entity/User';
export{}
declare global {
  namespace Express {
    interface Request {
      user: {
        userId: number;
        login: string;
      };
    }
  }
}