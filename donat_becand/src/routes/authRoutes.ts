import express, { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router: Router = express.Router();
const authController = new AuthController();

router.post('/register', 
    (req, res, next) => {
        authController.createUser(req, res)
            .catch(next);
    }
);

router.post('/login', 
    (req, res, next) => {
        authController.login(req, res)
            .catch(next);
    }
);

router.get('/profile', 
    AuthController.authMiddleware,
    (req, res, next) => {
        authController.getUserProfile(req, res)
            .catch(next);
    }
);

export default router;