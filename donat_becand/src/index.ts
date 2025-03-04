import 'reflect-metadata';
import  "./entity/User"
import 'express';
import express from 'express';
import { AppDataSource } from '../DataSourse';
import userRoutes from './routes/UserRoutes';
import transactionRoutes from './routes/transactionRoutes';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
const app = express();

app.use(cors({origin:'http://localhost:3001'}));

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Подключение к базе данных успешно установлено!');

    // Подключение маршрутов
    app.use('/api', userRoutes);
    app.use('/api', transactionRoutes);
    app.use('/api', authRoutes);
    app.use('/api', profileRoutes);

    app.listen(3000, () => {
      console.log('Сервер запущен на http://localhost:3000');
    });
  })
  .catch((error) => {
    console.log('Ошибка подключения к базе данных:', error);
  });

 