const mongoose = require('mongoose');

const Book = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    caption:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
        required: true,
    }, 
    description: {
        type: String,
        required: true,
    },
    bookImage:{
        type: String,
        required: true,
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }

}, {timestamps: true})

module.exports = mongoose.model('Book', Book);