const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { GraphQLError } = require('graphql')


// importing model 
const User = require('../../models/User')
const validateAuth = require('../../util/authValidation')

// validation 
const {validateRegisterInput, validateLoginInput} = require('../../util/userValidation')

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
    }, process.env.SECRET_KEY, {expiresIn: '12h'})
}

module.exports = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.find().sort({createdAt: -1})
                return users
            } catch (error) {
                throw new Error(error)
            }
        },
        getUser: async (_, {userId}) => {
            try {
                const user = await User.findById(userId)
                if(user) {
                    return user
                } else {
                    throw new Error('User not found')
                }
            } catch (error) {
                throw new Error(error)
            }
        },
    },

    Mutation: {
        register: async (_, {registerInput: {name, username, email, role, password, confirmPassword}}) => {
            
            // Validate data 
            const {errors, valid} = validateRegisterInput(name, username, email, role, password, confirmPassword)

            if(!valid) {
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }

            const usernameTaken = await User.findOne({ username })
            const emailTaken = await User.findOne({ email })

            if (usernameTaken && emailTaken) {
                throw new GraphQLError('Errors', {
                    extensions: {
                    code: 'BAD_USER_INPUT',
                    errors: {
                        username: 'Username is taken',
                        email: 'Email already exists',
                    },
                },
            })
            } else if (usernameTaken) {
                throw new GraphQLError('Errors', {
                    extensions: {
                    code: 'BAD_USER_INPUT',
                    errors: {
                        username: 'Username is taken',
                    },
                },
            })
            } else if (emailTaken) {
                throw new GraphQLError('Errors', {
                    extensions: {
                    code: 'BAD_USER_INPUT',
                    errors: {
                        email: 'Email already exists',
                    },
                },
            })
            }

            // hash password
            password = await bcrypt.hash(password, 12)

            // Create user and save
            const newUser = new User({
                name,
                username,
                email,
                role,
                isActive: true,
                isAdmin: false,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            // generate token 
            const token = generateToken(res)

            // return data 
            return {
                ...res._doc,
                id: res.id,
                token
            }
        }, 
        login: async (_,{email, password}) => {
            const {errors, valid} = validateLoginInput(email, password)

            if(!valid) {
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }
            // if(username.trim() === '') {
            //     throw new Error('Username must not be empty')
            // }
            // if(password === ''){
            //     throw new Error('Password must not be empty')
            // }

            // check if user exist 
            // Convert the username to lowercase to ensure case-insensitive matching
            const lowercaseEmail = email.toLowerCase()
            const user = await User.findOne({email: lowercaseEmail})

            if(!user) {
                throw new Error('Invalid email or password.')
            }

            if (!user.isActive) {
                throw new Error('User account is inactive.');
              }

            // Check password 
            const match = await bcrypt.compare(password, user.password)

            if(!match) {
                throw new Error('Invalid email or password.')
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user.id,
                token
            }
        },

        updateUser: async (_, {updateUserInput: {id, name, username, email, password, role, isActive, isAdmin}}, context) => {
            const user = validateAuth(context)

            // check Admin 
            const checkIsAdmin = user.isAdmin

            if (!checkIsAdmin && id !== user.id) {
                throw new Error('Unauthorized access')
            } else {
                // findUser 
                const userId = await User.findById(id);
                if (!userId) throw new Error('User not found')
                password = await bcrypt.hash(password, 12)

    
                if (name) userId.name = name
                if (username) userId.username = username
                if (email) userId.email = email
                // if (password !== undefined) userId.password = password
                if (password !== undefined && password !== "") {
                    userId.password = password
                  }
                if (role) userId.role = role
                if (isActive !== undefined) userId.isActive = isActive
                if (isAdmin !== undefined) userId.isAdmin = isAdmin
    
                await userId.save()
                return userId
            }

        },

        deactivateUser: async (_, { id }, context) => {
            const user = validateAuth(context);
            
            try {
              // check Admin 
              const checkIsAdmin = user.isAdmin;
            
              if (!checkIsAdmin && id !== user.id) {
                throw new Error('Unauthorized access');
              } else {
                // findUser 
                const userId = await User.findById(id);
                if (!userId) throw new Error('User not found');
                
                userId.isActive = !userId.isActive;
                await userId.save();
                
                return userId;
              }
            } catch (error) {
              console.error(error); // log the error
              throw new Error('Unable to update user');
            }
        },

        changePassword: async (_, {id, currentPassword, newPassword}, context) => {
            const user = validateAuth(context)

            try {
                if(user.id === id){
                    // Find user
                    const foundUser = await User.findById(id)
                    if (!foundUser) throw new Error('User not found')
                  
                    // Check if current password matches
                    const isMatch = await bcrypt.compare(currentPassword, foundUser.password)
                    if (!isMatch) throw new Error('Invalid current password')
                  
                    // Hash new password
                    const hashedPassword = await bcrypt.hash(newPassword, 12)
                  
                    // Update password
                    foundUser.password = hashedPassword
                    await foundUser.save()
                  
                    return foundUser
                }
                
            } catch (error) {
                throw new Error(error)
            }
          
          }
          

    }
}