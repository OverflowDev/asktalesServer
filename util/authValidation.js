const { GraphQLError } = require('graphql')

const jwt = require('jsonwebtoken')

module.exports = (context) => {
    // const authHeader = context.req.headers.authorization
    
    if(context.req.headers.authorization) {
        // Get token from header 
        const token = context.req.headers.authorization.split('Bearer ')[1]
        
        if(token) {
            try {
                // Verify token 
                const user = jwt.verify(token, process.env.SECRET_KEY)
                // Return user 
                return user
            } catch (error) {
                throw new GraphQLError('Invalid/Expired Token', {
                    extensions: {
                        code: 'GRAPHQL_VALIDATION_FAILED',
                        error
                    }
                })
            }
        }
        throw new Error("Authentication token must be 'bearer [token]")
    }
    throw new Error('Not Authorized - provide authorization header')
}
