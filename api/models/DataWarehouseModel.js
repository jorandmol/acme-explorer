import mongoose from 'mongoose'

const DataWarehouseSchema = new mongoose.Schema({
    tripsManagedByManager: [{
        averageTripsPerManager: Number,
        minTripsPerManager: Number,
        maxTripsPerManager: Number,
        stdDevTripsPerManager: Number
    }],
    applicationsPerTrip: [{
        averageApplicationsPerTrip: Number,
        minApplicationsPerTrip: Number,
        maxApplicationsPerTrip: Number,
        stdDevApplicationsPerTrip: Number
    }],
    tripsPrice: [{
        averagePrice: Number,
        minPrice: Number,
        maxPrice: Number,
        stdDevPrice: Number
    }],
    ratioOfApplicationsByStatus: [{
        _id: String,
        numApplications: Number
    }],
    averagePriceRange: [{
        averageMinPrice: Number,
        averageMaxPrice: Number
    }],
    topSearchedKeywords: [{
        _id: String,
        totalSearches: Number
    }],
    computationMoment: {
        type: Date,
        default: Date.now
    },
    rebuildPeriod: String
}, { strict: false })

DataWarehouseSchema.index({ computationMoment: -1 })

const model = mongoose.model('DataWarehouse', DataWarehouseSchema)
export const schema = model.schema
export default model