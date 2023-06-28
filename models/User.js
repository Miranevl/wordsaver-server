import mongoose from "mongoose";
const { Schema } = mongoose;

const userModel = new Schema({
    username: {
        type : String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash : {
        type: String,
        required: true
    },
    dictionaries : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dictonary'
    }]
});

export default mongoose.model('User', userModel);