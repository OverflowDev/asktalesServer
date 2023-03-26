const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

URI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(URI, {
            useUnifiedTopology: true, 
            useNewUrlParser: true
        })
        console.log(`MongoDB Connected to AskTales Database: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB