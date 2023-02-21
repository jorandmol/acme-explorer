import cron from "cron"
import DataWarehouse from "../models/DataWarehouseModel.js"
import Trip from "../models/TripModel.js"
import Application from "../models/ApplicationModel.js"
import Finder from "../models/FinderModel.js"
import StatusEnum from "../enum/StatusEnum.js"
import mongoose from "mongoose"

let defaultPeriod = "*/10 * * * * *"
let dataWarehouseJob

const buildNewDataWarehouse = (resultsDataWarehouse, period) => {
  const newDataWarehouse = new DataWarehouse()
  const [
    tripsManagedByManager,
    applicationsPerTrip,
    tripsPrice,
    ratioOfApplicationsByStatus,
    averagePriceRange,
    topSearchedKeywords
  ] = resultsDataWarehouse

  newDataWarehouse.tripsManagedByManager = tripsManagedByManager
  newDataWarehouse.applicationsPerTrip = applicationsPerTrip
  newDataWarehouse.tripsPrice = tripsPrice
  newDataWarehouse.ratioOfApplicationsByStatus = ratioOfApplicationsByStatus
  newDataWarehouse.averagePriceRange = averagePriceRange
  newDataWarehouse.topSearchedKeywords = topSearchedKeywords
  newDataWarehouse.rebuildPeriod = period

  return newDataWarehouse
}

const initializeDataWarehouseJob = () => {
  dataWarehouseJob = new cron.CronJob(defaultPeriod, async () => {
    console.log("Cron job submitted. Rebuild period: " + defaultPeriod)
    try {
      const dataWarehouseResults = await Promise.all([
        computeTripsManagedByManager(),
        computeApplicationsPerTrip(),
        computeTripsPrice(),
        computeRatioOfApplicationsByStatus(),
        computeAveragePriceRange(),
        computeTopSearchedKeywords()
      ])
      const newDataWarehouse = buildNewDataWarehouse(dataWarehouseResults, defaultPeriod)
      try {
        newDataWarehouse.save()
        console.log("new DataWarehouse succesfully saved. Date: " + new Date())
      } catch (err) {
        console.log("Error saving datawarehouse: " + err)
      }
    } catch (err) {
      console.log("Error computing datawarehouse: " + err)
    }
  }, null, true, "Europe/Madrid")
}

const restartDataWarehouseJob = (period) => {
  defaultPeriod = period
  dataWarehouseJob.setTime(new cron.CronTime(period))
  dataWarehouseJob.start()
}

const computeTripsManagedByManager = async () => {
  const tripsManagedByManager = await Trip.aggregate([
    {
      $facet: {
        managers: [{
          $group: { _id: "$creator" }
        },
        {
          $group: { _id: null, totalManagers: { $sum: 1 } }
        }],
        trips: [
          { $group: { _id: null, totalTrips: { $sum: 1 } } }
        ],
        tripsPerManager: [
          { $group: { _id: "$creator", numTripsPerManager: { $sum: 1 } } }
        ]
      }
    },
    {
      $project: {
        averageTripsPerManager: {
          $divide: [
            { $arrayElemAt: ["$trips.totalTrips", 0] },
            { $arrayElemAt: ["$managers.totalManagers", 0] }
          ]
        },
        minTripsPerManager: {
          $min: "$tripsPerManager.numTripsPerManager"
        },
        maxTripsPerManager: {
          $max: "$tripsPerManager.numTripsPerManager"
        },
        stdDevTripsPerManager: {
          $stdDevSamp: "$tripsPerManager.numTripsPerManager"
        }
      }
    }
  ])
  return tripsManagedByManager
}

const computeApplicationsPerTrip = async () => {
  const applicationsPerTrip = await Application.aggregate([
    {
      $facet: {
        trips: [{
          $group: { _id: "$trip" }
        },
        {
          $group: { _id: null, totalTrips: { $sum: 1 } }
        }],
        applications: [
          { $group: { _id: null, totalApplications: { $sum: 1 } } }
        ],
        applicationsPerTrip: [
          { $group: { _id: "$trip", numApplicationPerTrips: { $sum: 1 } } }
        ]
      }
    },
    {
      $project: {
        averageApplicationsPerTrip: {
          $divide: [
            { $arrayElemAt: ["$applications.totalApplications", 0] },
            { $arrayElemAt: ["$trips.totalTrips", 0] }
          ]
        },
        minApplicationsPerTrip: {
          $min: "$applicationsPerTrip.numApplicationPerTrips"
        },
        maxApplicationsPerTrip: {
          $max: "$applicationsPerTrip.numApplicationPerTrips"
        },
        stdDevApplicationsPerTrip: {
          $stdDevSamp: "$applicationsPerTrip.numApplicationPerTrips"
        }
      }
    }
  ])
  return applicationsPerTrip
}

const computeTripsPrice = async () => {
  const tripsPrice = await Trip.aggregate([
    {
      $group: {
        _id: 0,
        totalTrips: { $sum: 1 },
        totalPrice: { $sum: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        stdDevTripPrice: { $stdDevSamp: "$price" }
      }
    },
    {
      $project: {
        _id: 0,
        averagePrice: { $divide: ["$totalPrice", "$totalTrips"] },
        minPrice: "$minPrice",
        maxPrice: "$maxPrice",
        stdDevPrice: "$stdDevTripPrice"
      }
    }])
  return tripsPrice
}

const computeRatioOfApplicationsByStatus = async () => {
  const ratioOfApplicationsByStatus = await Application.aggregate([
    { $group: { _id: "$status", numApplications: { $sum: 1 } } }
  ])
  return ratioOfApplicationsByStatus
}

const computeAveragePriceRange = async () => {
  const averagePriceRange = await Finder.aggregate([
    {
      $group: {
        _id: 0,
        averageMinPrice: { $avg: "$minPrice" },
        averageMaxPrice: { $avg: "$maxPrice" }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ])
  return averagePriceRange
}

const computeTopSearchedKeywords = async () => {
  const topSearchedKeywords = await Finder.aggregate([
    {
      $group: {
        _id: "$keyword",
        totalSearches: { $sum: 1 }
      }
    },
    {
      $sort: { totalSearches: -1 }
    },
    {
      $limit: 10
    }
  ])
  return topSearchedKeywords
}

const computeSpentMoneyByExplorer = async ({ explorer, startDate, endDate }) => {
  console.log("Explorer: " + explorer)
  console.log("Start date: " + startDate)
  console.log("End date: " + endDate)
  const spentMoneyByExplorer = await Application.aggregate([
    {
      $match: {
        explorer: new mongoose.Types.ObjectId(explorer),
        status: StatusEnum.ACCEPTED,
        paidAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        }
      }
    }, {
      $lookup: {
        from: "trips",
        localField: "trip",
        foreignField: "_id",
        as: "trip"
      }
    }, {
      $unwind: {
        path: "$trip",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $group: {
        _id: 0,
        spentMoney: {
          $sum: "$trip.price"
        }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ])
  return spentMoneyByExplorer[0]
}

const computeExplorersBySpentMoney = async ({ startDate, endDate, operation }) => {

  const explorersBySpentMoney = await Application.aggregate([
    {
      $match: {
        status: StatusEnum.ACCEPTED,
        paidAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        }
      }
    }, {
      $lookup: {
        from: "trips",
        localField: "trip",
        foreignField: "_id",
        as: "trip"
      }
    }, {
      $unwind: {
        path: "$trip",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $group: {
        _id: "$explorer",
        spentMoney: {
          $sum: "$trip.price"
        }
      }
    },
    {
      $match: {
        spentMoney: operation
      }
    }
  ])
  return explorersBySpentMoney
}

export { initializeDataWarehouseJob, restartDataWarehouseJob, computeSpentMoneyByExplorer, computeExplorersBySpentMoney }
