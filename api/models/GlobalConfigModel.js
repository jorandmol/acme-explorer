import mongoose from 'mongoose'

const GlobalConfigSchema = new mongoose.Schema({
    defaultLanguage: {
        type: String,
        default: 'en'
    },
    cacheLifetime: {
        type: Number,
        default: 3600
    },
    numResults: {
        type: Number,
        default: 10
    },
    sponsorshipFlatRate: {
        type: Number,
        default: 0.1
    },
    dataWhRefresh : {
        type: Number,
        default: 10
    },
}, { timestamps: true })

const model = mongoose.model('GlobalConfig', GlobalConfigSchema)

export const schema = model.schema
export default model