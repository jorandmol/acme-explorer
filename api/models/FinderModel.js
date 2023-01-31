import mongoose from 'mongoose'

const FinderSchema = new mongoose.Schema({
    keyword: {
        type: String,
    },
    minPrice: {
        type: Number,
    },
    maxPrice: {
        type: Number,
    },
    minDate: {
        type: Date,
    },
    maxDate: {
        type: Date,
    }
}, { timestamps: true })

const model = mongoose.model('Finder', FinderSchema)

export const schema = model.schema
export default model