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
    },
    customToken: {
      type: String
    },
    idToken: {
      type: String
    },
}, { timestamps: true })

ActorSchema.pre('save', function (callback) {
    const actor = this
    // Break out if the password hasn't changed
    // if (!actor.isModified('password')) return callback()

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err)

        bcrypt.hash(actor.password, salt, function (err, hash) {
            if (err) return callback(err)
            actor.password = hash
            callback()
        })
    })
})

ActorSchema.pre('findOneAndUpdate', function (callback) {
    const actor = this._update
    if (actor.password) {
        bcrypt.genSalt(5, function (err, salt) {
            if (err) return callback(err)

            bcrypt.hash(actor.password, salt, function (err, hash) {
                if (err) return callback(err)
                actor.password = hash
                callback()
            })
        })
    }
    else {
        callback()
    }
})

ActorSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        // console.log('verifying password in actorModel: ' + password)
        if (err) return cb(err)
        // console.log('iMatch: ' + isMatch)
        cb(null, isMatch)
    })
}
const model = mongoose.model('Actor', ActorSchema)

export const schema = model.schema
export default model
  