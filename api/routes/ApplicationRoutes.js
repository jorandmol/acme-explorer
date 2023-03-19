import * as applicationController from '../controllers/ApplicationController.js'
import { creationValidator, updateCommentsValidator, rejectionValidator } from '../controllers/validators/ApplicationValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'
import { checkTrip } from '../middlewares/ApplicationBusinessRules.js'
import { verifyUser } from '../middlewares/AuthMiddleware.js'
import RoleEnum from '../enum/RoleEnum.js'

export default function (app) {

  /**
   * Get explorer applications
   *    Required role: Explorer
   * Post an application
   *    RequiredRoles: Explorer
   *
   * @section applications
   * @type get post
   * @url /applications
   */
  app.route('/v1/applications')
    .get(applicationController.listApplications)
    .post(
      creationValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.createApplication
    )
  app.route('/v2/applications')
    .get(verifyUser([RoleEnum.EXPLORER, RoleEnum.ADMINISTRATOR, RoleEnum.MANAGER]), applicationController.listApplicationsAuth)
    .post(
      verifyUser([RoleEnum.EXPLORER, RoleEnum.ADMINISTRATOR, RoleEnum.MANAGER]),
      creationValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.createApplication
    )

  /**
   * Get an application
   *    RequiredRoles: to be the trip creator or the explorer who created the application 
   *
   * @section applications
   * @type get
   * @url /applications/:id
   */
  app.route('/v1/applications/:id')
    .get(applicationController.readApplication)
    app.route('/v2/applications/:id')
    .get(verifyUser([RoleEnum.MANAGER, RoleEnum.EXPLORER, RoleEnum.ADMINISTRATOR]), applicationController.readApplicationAuth)

  /**
   * Cancel an application
   *   RequiredRoles: to be explorer who created the application
   *
   * @section applications
   * @type patch
   * @url /applications/:id/cancel
   *
   */
  app.route('/v1/applications/:id/cancel')
    .patch(
      checkTrip,
      applicationController.cancelApplication
    )
  app.route('/v2/applications/:id/cancel')
    .patch(
      verifyUser([RoleEnum.EXPLORER]),
      checkTrip,
      applicationController.cancelApplicationAuth
    )

  /**
   * Accept an application
   *  RequiredRoles: to be manager who created the trip
   *
   * @section applications
   * @type patch
   * @url /applications/:id/accept
   *
   */
  app.route('/v1/applications/:id/accept')
    .patch(
      checkTrip,
      applicationController.acceptApplication
    )
  app.route('/v2/applications/:id/accept')
    .patch(
      verifyUser([RoleEnum.MANAGER]),
      checkTrip,
      applicationController.acceptApplicationAuth
    )

  /**
   * Reject an application
   * RequiredRoles: to be manager who created the trip
   *
   * @section applications
   * @type patch
   * @url /applications/:id/reject
   *
   */
  app.route('/v1/applications/:id/reject')
    .patch(
      rejectionValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.rejectApplication
    )
  app.route('/v2/applications/:id/reject')
    .patch(
      verifyUser([RoleEnum.MANAGER]),
      rejectionValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.rejectApplicationAuth
    )

  /**
   * Pay an application
   * RequiredRoles: to be explorer who created the application
   *
   * @section applications
   * @type patch
   * @url /applications/:id/pay
   *
   */
  app.route('/v1/applications/:id/pay')
    .patch(
      checkTrip,
      applicationController.payApplication
    )
  app.route('/v2/applications/:id/pay')
    .patch(
      verifyUser([RoleEnum.EXPLORER, RoleEnum.ADMINISTRATOR]),
      checkTrip,
      applicationController.payApplicationAuth
    )

  /**
   * Update application comment
   * RequiredRoles: to be explorer who created the application
   *
   * @section applications
   * @type patch
   * @url /applications/:id/comment
   *
   */
  app.route('/v1/applications/:id/comments')
    .patch(
      updateCommentsValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.updateApplicationComments
    )
  app.route('/v2/applications/:id/comments')
    .patch(
      verifyUser([RoleEnum.EXPLORER, RoleEnum.MANAGER, RoleEnum.ADMINISTRATOR]),
      updateCommentsValidator,
      handleExpressValidation,
      checkTrip,
      applicationController.updateApplicationCommentsAuth
    )

}