import User from '../models/User.js';
import Dictonaries from '../models/Dictonaries.js';
import Word from '../models/Dictonaries.js';

export const create = async (req, res) => {
    const { userId, dictionaryId } = req.params; // получаем список параметров через диструктаризацию
    const { wordToTranslate, transcription, translatedWord } = req.body; // получаем список переменных из тела запроса
  
    try {
      const user = await User.findById(userId); //ищем пользователя 
      const dictonary = await Dictonaries.findById(dictionaryId); // ищем словарь
  
      //Проверяем принадлежит ли словарь пользователю , если нет ошибка
      if (user._id.toString() !== dictonary.user.toString()) { 
        return res.status(403).send('Это не Ваш словарь, доступ запрещен');
      }
      //Пушим с помощью метода Mongoose push , в массив слова
      dictonary.words.push({
        wordToTranslate: wordToTranslate,
        transcription: transcription,
        translatedWord: translatedWord
      });
  
      //Сохраняем изменения
      await dictonary.save();
      //Возвращаем результат  пользователю  
      res.json(dictonary.words);
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось добавить слова',
      });
    }
  };

export const getAll = async (req, res) => {
    const { userId, dictionaryId } = req.params;
    try {
      const user = await User.findById(userId); //ищем пользователя 
      const dictonary = await Dictonaries.findById(dictionaryId); // ищем словарь
      if (user._id.toString() !== dictonary.user.toString()) { 
        return res.status(403).send('Это не Ваш словарь, доступ запрещен');
      }
       res.json(dictonary.words);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message : 'Не удалось получить список слов',
      });
    } 
  };

export const getOne = async (req, res) => {
  const { userId, dictionaryId , wordId} = req.params;
  try {
    const user = await User.findById(userId); // ищем пользователя
    const dictonary = await Dictonaries.findById(dictionaryId); // ищем словарь
    if (!user || !dictonary) {
      return res.status(404).send('Пользователь или словарь не найдены');
    }
    if (user._id.toString() !== dictonary.user.toString()) {
      return res.status(403).send('Это не ваш словарь, доступ запрещен');
    }
    const word =  dictonary.words.reduce((word, acc) => {
      if(word._id.toString() === wordId){
        return word;
      }
      return acc;
    });

    res.json(word);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить слово',
    });
  }
}

export const deleteOne = async (req ,res) => {
    const { userId, dictionaryId, wordId} = req.params;
    try {
      const user = await User.findById(userId); //ищем пользователя 
      const dictionary = await Dictonaries.findByIdAndUpdate(dictionaryId, {
        $pull: { words: { _id: wordId } },
      }, { new: true });
  
      if (user._id.toString() !== dictionary.user.toString()) { 
        return res.status(403).send('Это не Ваш словарь, доступ запрещен');
      }
      res.json(dictionary);
    } catch (err) {
      console.error(err);
      res.status(500).send('Не удалось удалить слово');
    }
  };