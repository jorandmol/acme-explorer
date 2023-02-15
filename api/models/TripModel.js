import mongoose from 'mongoose'
import dateFormat from 'dateformat'
import { customAlphabet } from 'nanoid'

const generateId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

const SponsorshipSchema = new mongoose.Schema({
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Actor'
    },
    banner: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    isPayed: {
        type: Boolean,
        default: false
    }
})

const StageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    }
})

const TripSchema = new mongoose.Schema({
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
        required: false,
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
            required: false
        },
        image: {
            type: String,
            required: false
        }
    }],
    publicationDate: {
        type: Date,
        required: false
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
        StageSchema
    ],
    sponsorships: [
        SponsorshipSchema
    ]
}, { timestamps: true })

TripSchema.pre('save', function (callback) {
    const newTrip = this
    const date = dateFormat(new Date(), 'yymmdd')
    
    const ticker = `${date}-${generateId()}`
    newTrip.ticker = ticker

    // Initialize other values
    newTrip.pictures = []
    newTrip.stages = []
    newTrip.publicationDate = null
    newTrip.cancellationDate = null
    newTrip.cancelationReason = null

    callback()
})

const model = mongoose.model('Trip', TripSchema)

export const schema = model.schema
export default model