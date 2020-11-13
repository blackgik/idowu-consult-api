const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const validator =  require('validator');
const bcrypt = require('bcryptjs');


const AdimSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,

        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email format');
            }
        }

    },

    password: {
        type: String,
        trim: true,
        minlength: 6,
        required: true,

        validate(value) {
            if(value.includes('password')) {
                throw new Error('password should not contain password in lowercase');
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

// creating the token
AdimSchema.methods.generateAuthToken = async function() {
    const admin = this;

    const token = jwt.sign({_id: admin._id.toString()}, 'theidowuconsiulttoken');
    admin.tokens = admin.tokens.concat({ token })

    await admin.save()

    return token
}

// verifying the user
AdimSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if(!admin) {
        throw new Error('invalid user')
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if(!isMatch) {
        throw new Error('invalid user')
    }

    return admin;
}

// hashing the passwords
AdimSchema.pre('save', async function(next) {
    const user = this;
    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const Admin = mongoose.model('Admin', AdimSchema);


module.exports = Admin;