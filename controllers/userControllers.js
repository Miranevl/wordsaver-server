import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    
      try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const doc = new User({
              username,
              email,
              passwordHash : hash
          });

        const user = await doc.save();
        const { passwordHash, ...userData } = user._doc;
  
        res.json({
          ...userData,
        });
  
      } catch (err) {
          console.log(err);
          res.status(500).json({
              message: `Не удалось зарегистрироваться! ${err}`
          })
      }
  };

export const login = async(req, res) => {
    try{
    const user = await User.findOne({ email: req.body.email });
    if(!user){
      return res.status(404).json({
        message : "Email не найден в базе",
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if(!isValidPass){
      return res.status(404).json({
        message: 'Неверный пароль',
      });
    }
    const token = jwt.sign({
      _id: user._id,
  }, process.env.SECRET,
  {
      expiresIn: '30d',
  });
  const { passwordHash, ...userData } = user._doc;
  
  return res.json({
      ...userData,
      token,
  });
  
    }catch(err) {
      console.log(err);
      res.status(404).json({
        message: 'Произошла ошибка при авторизации',
      });
    }
  };

export const getInfoAboutMe = async (req, res) => {
    try{
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        message: 'Такого пользователя не существует',
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  
    }catch(err){
      console.log(err);
      res.status(404).json({
        message: 'Произошла ошибка авторизации',
      });
    }
  };