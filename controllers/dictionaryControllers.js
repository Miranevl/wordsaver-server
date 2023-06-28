import Dictonaries from '../models/Dictonaries.js';
import User from '../models/User.js';

export const create = async (req, res) => {
    try{
      const userId = req.params.userId;
      const dictonary = new Dictonaries({
        user : userId,
        name : req.body.name,
        words : [],
      });
  
      if(await User.findById(userId)){
        const savedDictionary = await dictonary.save();
        const updateUser =  await User.findByIdAndUpdate(userId, { $push: { dictionaries: savedDictionary._id } }).select("-passwordHash");
        res.json(updateUser);
      }
  
    
    }catch(err){
      console.log(err);
      res.status(404).json({
        message : 'Не удалось создать словарь',
      });
    }
  };

export const getAll = async (req, res) => {
    try {
      const userId = req.params.userId;
      const dictonary = await User.findById(userId).populate('dictionaries').select("-passwordHash").exec();
  
      if(!dictonary){
        res.status(404).json({
          message: 'Словари не найдены',
        });
      }
      res.json(dictonary);
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось получить словари',
      });
    }
  };

export const getOne = async (req, res) => {
    try {
      const dictionaryId = await req.params.dictionaryId;
      const dictionaries =  await Dictonaries.findById(dictionaryId);
      if(!dictionaries){
        return res.status(404).json({
          message: 'Данный словарь не найден',
        });
      }
      res.json(dictionaries);
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: 'Не удалось найти словарь',
      });
    }
  };

export const deleteOne = async (req , res) => {
    try {
      const userId = req.params.userId;
      const userDictonaryId = req.params.dictionaryId;
      const user = await User.findById(userId);
      const dictionaries =  await Dictonaries.findByIdAndDelete(userDictonaryId);
      if(!dictionaries){
        return res.status(404).json({
          message: 'Данный словарь не найден',
        });
      }
      user.dictionaries.pull(userDictonaryId);
      await user.save();
  
      res.json({
        success : true,
      });
  
    } catch (err) {
      console.log(err);
      res.status(404).json({
        message: 'Не удалось удалить данный словарь',
      });
    }
  };