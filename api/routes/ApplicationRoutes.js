import { listApplications, createApplication, readApplication, updateApplication, deleteApplication } from '../controllers/ApplicationController.js'
import { creationValidator } from '../controllers/validators/ApplicationValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {
  /**
  * Get an application
  *    Required role: None
  * Post an application
  *    RequiredRoles: Explorer
  *
  * @section applications
  * @type get post
  * @url /v1/applications
  */
  app.route('/v1/applications')
    .get(listApplications)
    .post(
      creationValidator,
      handleExpressValidation,
      createApplication
    )

  /**
  * Put an application
  *    RequiredRoles: to be explorer who created the application or manager who created the trip
  * Get an application
  *    RequiredRoles: None
  *
  * @section applications
  * @type get put
  * @url /v1/applications/:id
  */
  app.route('/v1/applications/:id')
    .get(readApplication)
    .put(updateApplication)
    .delete(deleteApplication)

}