import mongoose from 'mongoose'

const SponsorshipSchema = new mongoose.Schema({
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Sponsor id required',
        ref: 'Actor'
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Trip id required',
        ref: 'Trip'
    },
    banner: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    isPayed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const model = mongoose.model('Sponsorship', SponsorshipSchema)

export const schema = model.schema
export default model