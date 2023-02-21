import * as PromiseDataWarehouseService from "./PromiseDataWarehouseService.js"

const initializeDataWarehouseJob = () => {
  return PromiseDataWarehouseService.initializeDataWarehouseJob()
}

const restartDataWarehouseJob = (period) => {
  return PromiseDataWarehouseService.restartDataWarehouseJob(period)
}

const spentMoneyByExplorer = async (params) => {
  return await PromiseDataWarehouseService.computeSpentMoneyByExplorer(params)
}

const explorersBySpentMoney = async (params) => {
  return await PromiseDataWarehouseService.computeExplorersBySpentMoney(params)
}

export { initializeDataWarehouseJob, restartDataWarehouseJob, spentMoneyByExplorer, explorersBySpentMoney }
