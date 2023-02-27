import DataWarehouse from '../models/DataWarehouseModel.js'
import {
    restartDataWarehouseJob,
    spentMoneyByExplorer as spentMoneyByExplorerService,
    explorersBySpentMoney as explorersBySpentMoneyService
} from '../services/DataWarehouseServiceProvider.js'

const listIndicators = async (req, res) => {
    try {
        const indicators = await DataWarehouse.find().sort("-computationMoment").exec()
        res.send(indicators)
    } catch (err) {
        res.send(err)
    }
}

const lastIndicator = async (req, res) => {
    try {
        const indicator = await DataWarehouse.find().sort("-computationMoment").limit(1).exec()
        res.send(indicator)
    } catch (err) {
        res.send(err)
    }
}

const rebuildPeriod = (req, res) => {
    const { period } = req.body

    console.log("Updating rebuild period. Request: period: " + period + " seconds")
    restartDataWarehouseJob(period)

    res.status(200).send({period})
}

const spentMoneyByExplorer = async (req, res) => {
    const { explorer, startDate, endDate } = req.body
    const result = await spentMoneyByExplorerService({
        explorer,
        startDate,
        endDate
    })

    return res.status(200).send(result)
}

const explorersBySpentMoney = async (req, res) => {
    const { startDate, endDate, operation } = req.body

    const result = await explorersBySpentMoneyService({
        startDate,
        endDate,
        operation
    })

    return res.status(200).send(result)
}

export { listIndicators, lastIndicator, rebuildPeriod, spentMoneyByExplorer, explorersBySpentMoney }