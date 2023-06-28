import { body } from "express-validator";

export const registerValidation = [
    body('username', 'Имя не может быть меньше 3 символов!').isLength({ min : 3}),
    body('password')
    .isLength({ min : 6, max : 16})
    .withMessage('Пароль должен быть минимум 6 максимум 16 символов!')
    .matches(/[A-Z]/)
    .withMessage('Пароль должен содержать хотя бы одну заглавную букву!')
    .matches(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)
    .withMessage('Пароль должен содержать хотя бы один специальный символ!'),
    body('email', 'Введите корректную почту').isEmail(),
 ];

export const loginValidation = [
    body('email' , 'Введите правильный email или пароль').isEmail(),
    body('passwordHash' , 'Введите правильный логин или пароль').isLength({ min: 6}),
];