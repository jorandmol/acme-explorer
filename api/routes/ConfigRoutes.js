import { listConfig, updateConfig } from '../controllers/ConfigController.js'
import { configValidator } from '../controllers/validators/ConfigValidator.js'
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
  * @url /v1/config
  */
  app.route('/v1/config')
    .get(listConfig)
    .put(
      configValidator,
      handleExpressValidation,
      updateConfig
    )
}