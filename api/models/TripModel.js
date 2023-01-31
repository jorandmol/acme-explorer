import mongoose from 'mongoose'

const TripSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    pictures: {
        type: [String],
    },
    publicationDate: {
        type: Date,
        required: true
    },
    cancellationDate: {
        type: Date,
        default: null
    },
    cancelationReason: {
        type: String,
        default: null
    },
    stages: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true })

const model = mongoose.model('Trip', TripSchema)

export const schema = model.schema
export default model