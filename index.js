const express = require('express')

const {ApolloServer} = require('@apollo/server')
const {expressMiddleware } = require('@apollo/server/express4')

const cors = require('cors')

const {json} = require('body-parser')
const bodyParser = require('body-parser')

const dotenv = require('dotenv').config()

// Import db config
const connectDB = require('./db/config')

// importing typeDefs and resolvers 
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const PORT = process.env.PORT || 7000

async function startServer(){
    const app = express()

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        uploads: false
    })

    // start apolloServers
    await apolloServer.start()

    app.use('/askTales',
        cors(),
        json(),
        expressMiddleware(apolloServer, {
            context: async ({req}) => ({req})
        })
    )

    // connect DB 
    connectDB()

    // start server 
    await new Promise((resolve) => app.listen(PORT, resolve))
    console.log(`🚀 Server ready at http://localhost:${PORT}/askTales`)
}

startServer()
