import mongoose from "mongoose";
const { Schema } = mongoose;


const wordSchema = new mongoose.Schema({
    wordToTranslate: { type: String, required: true },
    transcription: { type: String },
    translatedWord: { type: String, required: true }
  });
  
export const Word = mongoose.model('Word', wordSchema);

const dictionariesModel = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name : {
        type : String,
        required : true
    },
    words: [wordSchema]
});

export default mongoose.model('Dictonary', dictionariesModel);