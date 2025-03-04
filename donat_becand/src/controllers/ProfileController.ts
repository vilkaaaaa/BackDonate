import { Request, Response } from "express";
import { ProfileService } from "../services/ProfileService";

const profileService = new ProfileService;

export class ProfileController{
//Вывод всех профилей
 async getProfiles(req: Request, res: Response) {
    const profile = await profileService.getAllProfile();
    res.json(profile);
 }
//Получить профиль пользователя ччерез id или UserId
async getProfileByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10); // Получаем ID пользователя из параметров запроса
      console.log('Переданный userId:', userId); // Логируем userId

      // Проверяем, что userId является числом
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Некорректный ID пользователя' });
      }

      // Получаем профиль по ID пользователя
      const profile = await profileService.getProfileByUserId(userId);

      if (!profile) {
        return res.status(404).json({ error: 'Профиль не найден' });
      }

      // Возвращаем профиль
      res.status(200).json(profile);
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
//обновить данные
async Update(req: Request, res: Response) {
  try {
    const profileId = parseInt(req.params.id, 10);
    if (isNaN(profileId)) {
      return res.status(400).json({ error: 'Некорректный ID профиля' });
    }

    const userData = req.body;
    const updatedProfile = await profileService.updateProfile(profileId, userData);
    
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Профиль не найден' });
    }
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
//Удалить профиль
async deleteProfile(req: Request, res: Response) {
  try {
    const profileId = parseInt(req.params.id, 10);
    if (isNaN(profileId)) {
      return res.status(400).json({ error: 'Некорректный ID профиля' });
    }
    
    await profileService.deletProfile(profileId);
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
}
