import * as actorController from '../controllers/ActorController.js'
import { creationValidator } from '../controllers/validators/ActorValidator.js'
import RoleEnum from '../enum/RoleEnum.js'
import { verifyUser } from '../middlewares/AuthMiddleware.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {

  /**
  * Get custom auth token, for an actor by providing email and password
  *
  * @section actors
  * @type get
  * @url /actors/login/
  * @param {string} email
  * @param {string} password
  */
  app.route('/v1/login/')
    .post(actorController.login)
  app.route('/v2/login/')
    .post(actorController.login)

  /**
  * Get actors
  *    Required role: Admin
  * Post an actor
  *    RequiredRoles: None
  *
  * @section actors
  * @type get post
  * @url /actors
  */
  app.route('/v1/actors')
    .get(actorController.listActors)
    .post(
      creationValidator,
      handleExpressValidation,
      actorController.createActor
    )
  app.route('/v2/actors')
    .get(
      verifyUser([RoleEnum.ADMINISTRATOR]), actorController.listActors)
    .post(
      creationValidator,
      handleExpressValidation,
      actorController.createActor
    )

  /**
  * Put an actor
  *    RequiredRoles: to be admin or the same user
  * Delete an actor
  *    RequiredRoles: to be admin or the same user
  * Get an actor
  *    RequiredRoles: None
  *
  * @section actors
  * @type get put
  * @url /actors/:id
  */
  app.route('/v1/actors/:id')
    .get(actorController.readActor)
    .put(actorController.updateActor)
    .delete(actorController.deleteActor)
  app.route('/v2/actors/:id')
    .get(actorController.readActor)
    .put(verifyUser(Object.values(RoleEnum)), actorController.updateActorAuth)
    .delete(verifyUser([RoleEnum.ADMINISTRATOR]), actorController.deleteActor)

  /**
   * Ban an actor
   *   RequiredRoles: to be admin
   * @section actors
   * @type patch
   * @url /actors/:id/ban
   */
  app.route('/v1/actors/:id/ban')
    .patch(actorController.banActor)
  app.route('/v2/actors/:id/ban')
    .patch(verifyUser([RoleEnum.ADMINISTRATOR]), actorController.banActor)

  /**
   * Unban an actor
   *  RequiredRoles: to be admin
   * @section actors
   * @type patch
   * @url /actors/:id/unban
   */
  app.route('/v1/actors/:id/unban')
    .patch(actorController.unbanActor)
  app.route('/v2/actors/:id/unban')
    .patch(verifyUser([RoleEnum.ADMINISTRATOR]), actorController.unbanActor)

}