import mongoose from 'mongoose';

const RecipieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: [ {
        type: String,
        required: true
    }],
    instruction:  {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    time:  {
        type: Number,
        required: true
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

});

export const RecipieModel = mongoose.model("recipie",RecipieSchema);