import * as configController from '../controllers/ConfigController.js'
import { configValidator } from '../controllers/validators/ConfigValidator.js'
import RoleEnum from '../enum/RoleEnum.js'
import { verifyUser } from '../middlewares/AuthMiddleware.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {
  /**
  * Get config
  *    Required role: Administrator
  * Put config
  *    RequiredRoles: Administrator
  *
  * @section config
  * @type get post
  * @url /config
  */
  app.route('/v1/config')
    .get(configController.listConfig)
    .put(
      configValidator,
      handleExpressValidation,
      configController.updateConfig
    )
  app.route('/v2/config')
    .get(verifyUser([RoleEnum.ADMINISTRATOR]), configController.listConfig)
    .put(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      configValidator,
      handleExpressValidation,
      configController.updateConfig
    )
}