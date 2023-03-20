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
    paidAt: {
        type: Date,
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

ApplicationSchema.statics.alreadyExists = async function (explorerId, tripId) {
    const application = await this.findOne({ explorer: explorerId, trip: tripId })
    if (application) return true
    else return false
}

ApplicationSchema.index({ explorer: 1 })
ApplicationSchema.index({ trip: 1 })
ApplicationSchema.index({ status: 1 })
ApplicationSchema.index({ trip: 1, status: 1 })

const model = mongoose.model('Application', ApplicationSchema)

export const schema = model.schema
export default model