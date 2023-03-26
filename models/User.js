const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    }, 

    username: {
        type: String,
        required: true 
    },

    email: {
        type: String,
        required: true 
    },

    role: {
        type: String,
        enum: ['storyteller', 'storyseeker'],
        required: true,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    password: {
        type: String,
        required: true 
    },

    createdAt: {
        type: String,
        required: true 
    },
})

const User = mongoose.model('User', UserSchema)

module.exports = User