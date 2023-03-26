const usersResolvers = require('./users')
const postsResolvers = require('./posts')
const commentsResolvers = require('./comments')


module.exports = {

    Post: {
        likeCount(parent) {
            return parent.likes.length
        },
        commentCount: (parent) => parent.comments.length
    },

    Query: {
        ...usersResolvers.Query,
        ...postsResolvers.Query,
    },

    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
    }
    
}