import 'reflect-metadata';
import  "./entity/User"
import 'express';
import express from 'express';
import { AppDataSource } from '../DataSourse';
import userRoutes from './routes/UserRoutes';
import cors from 'cors';
const app = express();

app.use(cors({origin:'http://localhost:3001'}));

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Подключение к базе данных успешно установлено!');

    // Подключение маршрутов
    app.use('/api', userRoutes);

    app.listen(3000, () => {
      console.log('Сервер запущен на http://localhost:3000');
    });
  })
  .catch((error) => {
    console.log('Ошибка подключения к базе данных:', error);
  });

 