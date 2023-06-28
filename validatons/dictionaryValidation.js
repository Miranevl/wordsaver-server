import { body } from "express-validator";

export const createDictionaryValidation = [
    body('name', 'Имя должно быть от 2 до 15 символов').isLength( {min : 2 , max : 15}),
];

export const createWordValidation = [
    body('wordToTranslate' , 'Слово должно быть от 2 до 15 символов').isLength({min : 2 , max : 15}).isString(),
    body('transcription', 'Транскрипция должна быть строкой').isString(),
    body('translatedWord', 'Перевод должен быть от 2 до 15 символов').isLength({min : 2, max : 15}).isString()
];

