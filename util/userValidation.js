module.exports.validateRegisterInput = (
    name, 
    username,
    email,
    role,
    password,
    confirmPassword
) => {
    const errors = {}

    
    if(name.trim() === '') {
        errors.name = 'Name must not be empty'
    }

    if(username.trim() === '') {
        errors.username = 'Username must not be empty'
    }else {
        const hasSpace = username.indexOf(' ') !== -1;
        if (hasSpace) {
        errors.username = 'Username cannot contain spaces';
        }
    }

    if(email.trim() === '') {
        errors.email = 'Email must not be empty'
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
        if(!email.match(regEx)){
            errors.email = "Please enter a valid email address"
        }
    }

    if(role.trim() === '') {
        errors.role = 'Role must not be empty'
    } else {
        const hasSpace = role.indexOf(' ') !== -1;
        if (hasSpace) {
        errors.role = 'Role cannot contain spaces';
        }
    }

    if(password === ''){
        errors.password = 'Password must not be empty'
    } else if(password !== confirmPassword) {
        errors.password = 'Password must match'
    }

    return { 
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (
    email,
    password,
) => {
    const errors = {}

    if(email.trim() === '') {
        errors.email = 'Email must not be empty'
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
        if(!email.match(regEx)){
            errors.email = "Please enter a valid email address"
        }
    }

    if(password === ''){
        errors.password = 'Password must not be empty'
    }

    return { 
        errors,
        valid: Object.keys(errors).length < 1
    }
}