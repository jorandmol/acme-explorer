import * as applicationController from '../controllers/ApplicationController.js'
import { creationValidator, updateCommentsValidator, rejectionValidator } from '../controllers/validators/ApplicationValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'
import { checkTrip } from '../middlewares/ApplicationBusinessRules.js'

export default function (app) {
  /**
   * Get an application
   *    Required role: Explorer
   * Post an application
   *    RequiredRoles: Explorer
   *
   * @section applications
   * @type get post
   * @url /v1/applications
   */
  app.route('/v1/applications')
    .get(applicationController.listApplications)
    .post(
      creationValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.createApplication
    )

  /**
   * Get an application
   *    RequiredRoles: None
   *
   * @section applications
   * @type get
   * @url /v1/applications/:id
   */
  app.route('/v1/applications/:id')
    .get(applicationController.readApplication)

  /**
   * Cancel an application
   *   RequiredRoles: to be explorer who created the application
   *
   * @section applications
   * @type patch
   * @url /v1/applications/:id/cancel
   *
   */
  app.route('/v1/applications/:id/cancel')
    .patch(
      checkTrip,
      applicationController.cancelApplication
    )

  /**
   * Accept an application
   *  RequiredRoles: to be manager who created the trip
   *
   * @section applications
   * @type patch
   * @url /v1/applications/:id/accept
   *
   */
  app.route('/v1/applications/:id/accept')
    .patch(
      checkTrip,
      applicationController.acceptApplication
    )

  /**
   * Reject an application
   * RequiredRoles: to be manager who created the trip
   *
   * @section applications
   * @type patch
   * @url /v1/applications/:id/reject
   *
   */
  app.route('/v1/applications/:id/reject')
    .patch(
      rejectionValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.rejectApplication
    )

  /**
   * Pay an application
   * RequiredRoles: to be explorer who created the application
   *
   * @section applications
   * @type patch
   * @url /v1/applications/:id/pay
   *
   */
  app.route('/v1/applications/:id/pay')
    .patch(
      checkTrip,
      applicationController.payApplication
    )

  /**
   * Update application comment
   * RequiredRoles: to be explorer who created the application
   *
   * @section applications
   * @type patch
   * @url /v1/applications/:id/comment
   *
   */
  app.route('/v1/applications/:id/comments')
    .patch(
      updateCommentsValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.updateApplicationComments
    )


}