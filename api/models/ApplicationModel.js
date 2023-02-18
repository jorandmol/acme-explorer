import mongoose from 'mongoose'
import StatusEnum from '../enum/StatusEnum.js'

const ApplicationSchema = new mongoose.Schema({
    explorer: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Explorer id required',
        ref: 'Actor'
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Trip id required',
        ref: 'Trip'
    },
    status: {
        type: String,
        enum: StatusEnum,
        default: StatusEnum.PENDING,
    },
    rejectionReason: {
        type: String,
        default: null
    },
    cancellationDate: {
        type: Date,
        default: null
    },
    comments: {
        type: String,
        default: null
    }
}, { timestamps: true })

const model = mongoose.model('Application', ApplicationSchema)

export const schema = model.schema
export default model