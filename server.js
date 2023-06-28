import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { registerValidation , loginValidation} from './validatons/userValidations.js';
import checkAuth from './middleware/checkAuth.js';
import { createDictionaryValidation, createWordValidation } from './validatons/dictionaryValidation.js';
import * as userControllers from './controllers/userControllers.js';
import * as dictionaryControllers from './controllers/dictionaryControllers.js';
import * as wordsControllers from './controllers/wordsControllers.js';
import handleValidationErrors from './middleware/validationsErrors.js';
import cors from 'cors'

dotenv.config();
const port = process.env.PORT;
const url = process.env.URL;
const secret = process.env.SECRET;

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(url)
.then(() => console.log('DB OK!'))
.catch((err) => console.log(err));

//Регистрация
app.post('/register', registerValidation, handleValidationErrors, userControllers.register);
//Аутентификация 
app.post('/login', loginValidation, userControllers.login);
//Получения данных о пользователе
app.get('/users/:userId', checkAuth, userControllers.getInfoAboutMe);

//Создание словаря
app.post('/users/:userId/dictionaries', checkAuth, createDictionaryValidation, handleValidationErrors, dictionaryControllers.create);
//Получение всех словарей
app.get('/users/:userId/dictionaries' , checkAuth , dictionaryControllers.getAll);
//Получение одного словаря
app.get('/users/:userId/dictionaries/:dictionaryId' , checkAuth, dictionaryControllers.getOne);
//Удаление словаря
app.delete('/users/:userId/dictionaries/:dictionaryId' , checkAuth , dictionaryControllers.deleteOne);

//Создание СЛОВ для словаря
app.post('/users/:userId/dictionaries/:dictionaryId/words' , checkAuth , createWordValidation, handleValidationErrors, wordsControllers.create);
//Получения списка всех СЛОВ из конкретного словаря
app.get('/users/:userId/dictionaries/:dictionaryId/words' , checkAuth , wordsControllers.getAll);
//Получение конкретного СЛОВА из словаря
app.get('/users/:userId/dictionaries/:dictionaryId/words/:wordId', checkAuth, wordsControllers.getOne);
//Удаление конкретного СЛОВА из словаря
app.delete('/users/:userId/dictionaries/:dictionaryId/words/:wordId' , checkAuth , wordsControllers.deleteOne);

app.listen(process.env.PORT || 4444 , (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Server OK!')
    }
})

export {secret , app};