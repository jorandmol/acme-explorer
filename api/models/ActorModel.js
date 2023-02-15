import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import RoleEnum from '../enum/RoleEnum.js'

const ActorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(RoleEnum),
        required: true
    },
    ban: {
        date: {
            type: Date,
        },
        reason: {
            type: String,
        }
    }
}, { timestamps: true })

const model = mongoose.model('Actor', ActorSchema)

ActorSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
});

export const schema = model.schema
export default model