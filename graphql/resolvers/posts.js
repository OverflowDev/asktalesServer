const { GraphQLError } = require('graphql')
const Post = require('../../models/Post')

const validateAuth = require('../../util/authValidation')
// const {validateFormInput} = require('../../util/formValidation')

const cloudinary = require('cloudinary').v2

const dotenv = require('dotenv').config()

// // Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({createdAt: -1})
                return posts
            } catch (error) {
                throw new Error(error)
            }
        }, 
        getPost: async (_, {postId}) => {
            try {
                const post = await Post.findById(postId)

                if(post) {
                    return post
                } else {
                    throw new Error('Post not found')
                }
            } catch(error) {
                throw new Error(error)
            }
        }
    }, 

    Mutation: {
        createPost: async (_, {postInput: {title, content, location, image1, image2}}, context) => {
            const user = validateAuth(context)

            // validate form 
            if (title.trim() === '' || content.trim() === '' || location === '' || image1.trim() === '' || image2.trim() === '') {
                throw new Error('Post title, content, location and image must not be empty')
            }

            const uploadOptions = {
                folder: 'posts',
                resource_type: 'auto',
              };

            try {
                // const res = await cloudinary.uploader.upload(image1, uploadOptions)

                const [img1, img2] = await Promise.all([
                    cloudinary.uploader.upload(image1, uploadOptions),
                    cloudinary.uploader.upload(image2, uploadOptions),
                ])

                const newPost = new Post({
                    title,
                    content,
                    location,
                    username: user.username,
                    imageUrl1: img1.secure_url,
                    imageUrl2: img2.secure_url,
                    user: user.id,
                    createdAt: new Date().toISOString()
                })

                const post = await newPost.save()
                return post

            } catch (error) {
                console.error(error);
                throw new Error('Failed to upload file to Cloudinary');
            }

        },

        deletePost: async (_, {postId}, context) => {
            const user = validateAuth(context)

            try {
                const post = await Post.findById(postId)
                if(user.username === post.username) {
                    await post.deleteOne()
                    return post
                } else {
                    throw new GraphQLError('Actions not allowed', {
                        extensions: {
                            code: 'GRAPHQL_VALIDATION_FAILED',
                            error
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }, 

        updatePost: async (_, {updatePostInput: {id, title, content, location}}, context) => {
            const user = validateAuth(context);

            // validate form 
            if (title.trim() === '' || content.trim() === '' || location === '' ) {
                throw new Error('Post title, content, location and image must not be empty')
            }
          
            // const uploadOptions = {
            //     folder: 'posts',
            //     resource_type: 'auto',
            // };
          
            try {
                // const [img1, img2] = await Promise.all([
                //     cloudinary.uploader.upload(image1, uploadOptions),
                //     cloudinary.uploader.upload(image2, uploadOptions),
                // ]);
                const post = await Post.findById(id);
          
                if (!post) {
                    throw new Error('Post not found');
                }
          
                // Check if user is an admin or the post owner
                if (!(user.isAdmin || post.user.toString() === user.id)) {
                    throw new Error('Unauthorized to edit post');
                }

                // let imageUrl1 = post.imageUrl1
                // let imageUrl2 = post.imageUrl2

                 // Check if image1 link is updated
                // if (image1 && image1 !== imageUrl1) {
                //     const uploadOptions = {
                //         folder: 'posts',
                //         resource_type: 'auto',
                //         transformation: [{ width: 1000, height: 1000, crop: 'limit' }]

                //     };
                //     const res1 = await cloudinary.uploader.upload(image1, uploadOptions)
                //     if (res1.bytes > 10485760) {
                //         throw new Error('Image size exceeds 10MB limit');
                //     }
                //     imageUrl1 = res1.secure_url;
                // }

                // Check if image2 link is updated
                // if (image2 && image2 !== imageUrl2) {
                //     const uploadOptions = {
                //         folder: 'posts',
                //         resource_type: 'auto',
                //         transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
                //     };
                //     const res2 = await cloudinary.uploader.upload(image2, uploadOptions)
                //     if (res2.bytes > 10485760) {
                //         throw new Error('Image size exceeds 10MB limit');
                //     }
                //     imageUrl2 = res2.secure_url;
                // }
          
                post.title = title;
                post.content = content;
                post.location = location;
                // post.imageUrl1 = imageUrl1;
                // post.imageUrl2 = imageUrl2;
                post.updatedAt = new Date().toISOString();
          
                const updatedPost = await post.save();
                return updatedPost;
          
            } catch (error) {
                console.error(error);
                throw new Error('Failed to upload file to Cloudinary');
            }
        },
          

        likePost: async (_, {postId}, context) => {
            const {username} = validateAuth(context)
            
            const post = await Post.findById(postId)
            if(post) {

                if(post.likes.find(like => like.username === username)){
                    // post already liked - unlike the post 
                    post.likes = post.likes.filter(like => like.username !== username)
                } else {
                    // not a liked post 
                    post.likes.push({
                        username, 
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save()
                return post

            } else {
                throw new GraphQLError('Quote not found', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
        }
    }
}