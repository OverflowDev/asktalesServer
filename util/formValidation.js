const mongoose = require('mongoose')

module.exports.validateFormInput = (
    title,
    content,
    location,
    image1,
    image2
) => {
    const errors = {}

    if(title.trim() === '') {
        errors.title = 'Title must not be empty'
    }

    if(content.trim() === '') {
        errors.content = 'Content must not be empty'
    }

    if(location === '') {
        errors.category = 'Category must not be empty'
    }

    if(image1.trim() === '') {
        errors.image = 'Image must not be empty'
    }

    if(image2.trim() === '') {
        errors.image = 'Image must not be empty'
    }

    return { 
        errors,
        valid: Object.keys(errors).length < 1
    }
}