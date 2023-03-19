import * as actorController from '../controllers/ActorController.js'
import { creationValidator } from '../controllers/validators/ActorValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {

  /**
  * Get custom auth token, for an actor by providing email and password
  *
  * @section actors
  * @type get
  * @url /v1/actors/login/
  * @param {string} email
  * @param {string} password
  */
  app.route('/v1/login/')
    .post(actorController.login)

  /**
  * Get an actor
  *    Required role: None
  * Post an actor
  *    RequiredRoles: Manager
  *
  * @section actors
  * @type get post
  * @url /v1/actors
  */
  app.route('/v1/actors')
    .get(actorController.listActors)
    .post(
      creationValidator,
      handleExpressValidation,
      actorController.createActor
    )

  /**
  * Put an actor
  *    RequiredRoles: to be manager
  * Get an actor
  *    RequiredRoles: None
  *
  * @section actors
  * @type get put
  * @url /v1/actors/:id
  */
  app.route('/v1/actors/:id')
    .get(actorController.readActor)
    .put(actorController.updateActor)
    .delete(actorController.deleteActor)

  /**
   * Ban an actor
   *   RequiredRoles: to be manager
   * @section actors
   * @type patch
   * @url /v1/actors/:id/ban
   */
  app.route('/v1/actors/:id/ban')
    .patch(actorController.banActor)

  /**
   * Unban an actor
   *  RequiredRoles: to be manager
   * @section actors
   * @type patch
   * @url /v1/actors/:id/unban
   */
  app.route('/v1/actors/:id/unban')
    .patch(actorController.unbanActor)

}