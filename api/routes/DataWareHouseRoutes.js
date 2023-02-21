import { listIndicators, generateIndicators, spentMoneyByExplorer, explorersBySpentMoney } from '../controllers/DataWareHouseController.js';
import { cube1Validator, cube2Validator } from '../controllers/validators/DataWareHouseValidator.js';
import handleExpressValidation from "../middlewares/ValidationHandlingMiddleware.js";
import { periodDecoder } from "../middlewares/CubePeriodDecoder.js";
import { operationParser } from '../middlewares/OperationParser.js';

export default function (app) {

  app.route('/v1/dashboard')
    .get(listIndicators)
    .post(generateIndicators)

  app.route('/v1/cube/spentMoneyByExplorer')
    .post(
      cube1Validator,
      handleExpressValidation,
      periodDecoder,
      spentMoneyByExplorer)

  app.route('/v1/cube/explorersBySpentMoney')
    .post(
      cube2Validator,
      handleExpressValidation,
      periodDecoder,
      operationParser,
      explorersBySpentMoney)
}