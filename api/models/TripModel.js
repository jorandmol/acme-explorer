import mongoose from 'mongoose'
import dateFormat from 'dateformat'
import { customAlphabet } from 'nanoid'

const generateId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

const sponsorshipSchema = new mongoose.Schema({
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor'
    },
    banner: {
        type: String,
    },
    link: {
        type: String,
    },
    financedAmount: {
        type: Number,
        default: 0.0
    },
    paidAt: {
        type: Date,
        default: null
    }
})

const stageSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    }
})

const tripSchema = new mongoose.Schema({
    ticker: {
        type: String,
        unique: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Manager id required',
        ref: 'Actor'
    },
    title: {
        type: String,
        required: 'Title is required',
        maxLength: 100
    },
    description: {
        type: String,
        required: 'Description is required',
        minLength: 10,
        maxLength: 255
    },
    price: {
        type: Number,
        default: 0.0
    },
    requirements: {
        type: String,
        required: 'Set trip\'s requirements',
        minLength: 10,
        maxLength: 255
    },
    startDate: {
        type: Date,
        required: 'Start date is required'
    },
    endDate: {
        type: Date,
        required: 'End date is required'
    },
    pictures: [{
        title: {
            type: String,
        },
        image: {
            type: String,
        }
    }],
    publicationDate: {
        type: Date,
        default: null
    },
    cancellationDate: {
        type: Date,
        default: null
    },
    cancellationReason: {
        type: String,
        default: null
    },
    stages: [
        stageSchema
    ],
    sponsorships: [
        sponsorshipSchema
    ]
}, { timestamps: true })

tripSchema.index({ creator: 1 })
tripSchema.index({ ticker: 'text', title: 'text', description: 'text' })

tripSchema.pre('save', function (callback) {
    const newTrip = this
    const date = dateFormat(new Date(), 'yymmdd')

    const ticker = `${date}-${generateId()}`
    newTrip.ticker = ticker

    // Initialize other values
    newTrip.pictures = []
    newTrip.stages = []
    newTrip.sponsorships = []

    callback()
})

const model = mongoose.model('Trip', tripSchema)

export const schema = model.schema
export default model