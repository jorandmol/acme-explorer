import mongoose from 'mongoose'
import StatusEnum from '../enum/StatusEnum'

const ApplicationSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: StatusEnum,
        default: StatusEnum.PENDING,
    },
    cancelationDate: {
        type: Date,
        default: null
    },
    comments: {
        type: String
    }
}, { timestamps: true })

const model = mongoose.model('Application', ApplicationSchema)

export const schema = model.schema
export default model