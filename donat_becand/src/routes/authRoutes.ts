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

router.post('/user', 
     AuthController.authMiddleware, (req, res) => {
        authController.getUserProfile(req, res)
    }
);

export default router;