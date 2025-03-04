import  express  from "express";
import { ProfileController } from "../controllers/ProfileController";

const router = express.Router();
const profileController = new ProfileController();
//Получение пользователя по id
router.get('/profile/user/:userId', async (req, res) => {
    await profileController.getProfileByUser(req, res);
  });
  router.get('/profile/userUp/:userId', async (req, res) => {
    await profileController.getProfileByUser(req, res);
  });
export default router;