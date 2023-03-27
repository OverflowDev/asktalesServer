
const typeDefs = `

    type Post {
        id: ID!
        title: String!
        content: String!
        location: String!
        username: String!
        imageUrl1: String!
        imageUrl2: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
        createdAt: String!
    }

    type Comment {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }

    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }

    type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        password: String!
        role: String!
        isActive: Boolean!
        isAdmin: Boolean!
        token: String!
        createdAt: String!
    }
    
    input PostInput {
        title: String!
        content: String!
        location: String!
        image1: String!
        image2: String!
    }

    input RegisterInput {
        name: String!
        email: String!
        username: String!
        role: String!
        password: String!
        confirmPassword: String!
    }

    input UpdateUserInput {
        id: ID!
        name: String!
        username: String!
        email: String!
        password: String
        role: String!
        isActive: Boolean!
        isAdmin: Boolean!
    }

    input UpdatePostInput {
        id: ID!
        title: String!
        content: String!
        location: String!
        imageUrl1: String
        imageUrl2: String
    }

    type Query {

        getUsers: [User]
        getUser(userId: ID!): User!

        getPosts: [Post]
        getPost(postId: ID!): Post!

    }
    
    type Mutation {
        register(registerInput: RegisterInput):  User!
        login(email: String!, password: String!):  User!

        updateUser(updateUserInput: UpdateUserInput): User!
        deactivateUser(id: ID!): User!
        changePassword(id: ID!, currentPassword: String!, newPassword: String!): User!
        
        createPost(postInput: PostInput): Post!
        deletePost(postId: ID!): Post!
        updatePost(updatePostInput: UpdatePostInput): Post!
        likePost(postId: ID!): Post!

        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!

    }

`

module.exports = typeDefs