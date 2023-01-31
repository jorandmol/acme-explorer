import mongoose from 'mongoose'

const GlobalConfigSchema = new mongoose.Schema({
    cacheDuration: {
        type: Number,
        default: 3600
    },
    numResults: {
        type: Number,
        default: 10
    },
    flatRate: {
        type: Number,
        default: 0.1
    }
}, { timestamps: true })

const model = mongoose.model('GlobalConfig', GlobalConfigSchema)

export const schema = model.schema
export default model