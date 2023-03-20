import * as dataWarehouseController from '../controllers/DataWarehouseController.js'
import { rebuildPeriodValidator, spentMoneyByExplorerValidator, explorersBySpentMoneyValidator } from '../controllers/validators/DataWarehouseValidator.js'
import handleExpressValidation from "../middlewares/ValidationHandlingMiddleware.js"
import { periodDecoder } from "../middlewares/CubePeriodDecoder.js"
import { operationParser } from '../middlewares/OperationParser.js'
import { verifyUser } from '../middlewares/AuthMiddleware.js'
import RoleEnum from '../enum/RoleEnum.js'

export default function (app) {

  /**
   * Get a list of all indicators
   * RequiredRole: Administrator
   * @section dashboard
   * @type get post
   * @url /dashboard
  */
  app.route('/v1/dashboard')
    .get(dataWarehouseController.listIndicators)
  app.route('/v2/dashboard')
    .get(verifyUser([RoleEnum.ADMINISTRATOR]), dataWarehouseController.listIndicators)

  /**
   * Get a list of last computed indicator
   * RequiredRole: Administrator
   * @section dashboard
   * @type get
   * @url /dashboard/latest
  */
  app.route("/v1/dashboard/latest")
    .get(dataWarehouseController.lastIndicator)
  app.route("/v2/dashboard/latest")
    .get(verifyUser([RoleEnum.ADMINISTRATOR]), dataWarehouseController.lastIndicator)

  /**
   * Update computation period for rebuilding
   * RequiredRole: Administrator
   * @section dashboard
   * @type patch
   * @url /dashboard/rebuild-period
   * @param {number} rebuildPeriod - Period to rebuild in seconds
  */
  app.route('/v1/dashboard/rebuild-period')
    .patch(
      rebuildPeriodValidator,
      handleExpressValidation,
      dataWarehouseController.rebuildPeriod
    )
  app.route('/v2/dashboard/rebuild-period')
    .patch(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      rebuildPeriodValidator,
      handleExpressValidation,
      dataWarehouseController.rebuildPeriod
    )

  /**
   * Get a list of all indicators about the amount of money that an explorer spent in a period
   * RequiredRole: Administrator
   * @section dashboard
   * @type post
   * @url /dashboard/spent-money-by-explorer
  */
  app.route('/v1/dashboard/spent-money-by-explorer')
    .post(
      spentMoneyByExplorerValidator,
      handleExpressValidation,
      periodDecoder,
      dataWarehouseController.spentMoneyByExplorer)
  app.route('/v2/dashboard/spent-money-by-explorer')
    .post(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      spentMoneyByExplorerValidator,
      handleExpressValidation,
      periodDecoder,
      dataWarehouseController.spentMoneyByExplorer)

  /**
   * Get a list of explorers ids and the amount of money that they spent in a period
   * RequiredRole: Administrator
   * @section dashboard
   * @type post
   * @url /dashboard/explorers-by-spent-money
  */
  app.route('/v1/dashboard/explorers-by-spent-money')
    .post(
      explorersBySpentMoneyValidator,
      handleExpressValidation,
      periodDecoder,
      operationParser,
      dataWarehouseController.explorersBySpentMoney)
  app.route('/v2/dashboard/explorers-by-spent-money')
    .post(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      explorersBySpentMoneyValidator,
      handleExpressValidation,
      periodDecoder,
      operationParser,
      dataWarehouseController.explorersBySpentMoney)
}