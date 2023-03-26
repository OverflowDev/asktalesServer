const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageUrl1: {
        type: String,
        required: true
    },
    imageUrl2: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    comments: [
        {
            body: {
                type: String
            }, 
            username: {
                type: String
            },
            createdAt: {
                type: String
            },
        }
    ],
    likes: [
        { 
            username: {
                type: String
            },
            createdAt: {
                type: String
            },
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post