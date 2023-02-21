import mongoose from 'mongoose'

const DataWareHouseSchema = new mongoose.Schema({
    tripsManagedByManager: {},
    applicationsPerTrip: {},
    tripsPrice: {},
    ratioOfApplicationsByStatus: {},
    averagePriceRange: {},
    topSearchedKeywords: {}
}, { strict: false })

const model = mongoose.model('DataWareHouse', DataWareHouseSchema)
export const schema = model.schema
export default model