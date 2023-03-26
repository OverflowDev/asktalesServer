const Post = require("../../models/Post")

const validateAuth = require("../../util/authValidation")

const { GraphQLError } = require('graphql')

module.exports = {

    Mutation: {
        createComment: async (_, {postId, body}, context) => {
            const {username} = validateAuth(context)

            if(body.trim() === '') {
                throw new GraphQLError('Empty Comment', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        body: 'Comment body must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId)

            if(post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })

                await post.save()
                return post
            } else {
                throw new GraphQLError('post not found')
            }
        }, 

        deleteComment: async (_, {postId, commentId}, context) => {
            
            const {username} = validateAuth(context)

            const post = await Post.findById(postId)

            if(post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId)
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1)
                    await post.save()
                    return post
                } else {
                    throw new GraphQLError('Action not allowed', {
                        extensions: {
                            code: 'GRAPHQL_VALIDATION_FAILED',
                        }
                    })
                }
            } else {
                throw new GraphQLError('Post not found', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
        }
    }
}