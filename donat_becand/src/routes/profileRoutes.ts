import  express  from "express";
import { ProfileController } from "../controllers/ProfileController";

const router = express.Router();
const profileController = new ProfileController();
//Получение пользователя по id
router.get('/profile/user/:userId', async (req, res) => {
    await profileController.getProfileByUser(req, res);
  });

  // получение всех профилей
  router.get('/profiles/all', async (req, res) => {
    await profileController.getProfiles(req, res);
  });

  router.patch('/profile/userUp/:userId', async (req, res) => {
    await profileController.Update(req, res);
  });

  router.get('/profile/del/:profileId', async (req, res) => {
    await profileController.deleteProfile(req, res);
  });
export default router;