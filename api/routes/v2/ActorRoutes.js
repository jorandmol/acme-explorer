import { listActors, createActor, readActor, updateActor, deleteActor, banActor, unbanActor } from '../../controllers/ActorController.js'
import { creationValidator } from '../../controllers/validators/ActorValidator.js'
import RoleEnum from '../../enum/RoleEnum.js'
import { verifyUser } from '../../middlewares/AuthMiddleware.js'
import handleExpressValidation from '../../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {
  /**
  * Get actors
  *    Required role: Administrator
  * Post an actor
  *    RequiredRoles: None
  *
  * @section actors
  * @type get post
  * @url /v2/actors
  */
  app.route('/v2/actors')
    .get(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      listActors
    ).post(
      creationValidator,
      handleExpressValidation,
      createActor
    )

  /**
  * Put an actor
  *    RequiredRoles: Administrator or the same user
  * Delete an actor
  *    RequiredRoles: Administrator
  * Get an actor
  *    RequiredRoles: None
  *
  * @section actors
  * @type get put
  * @url /v2/actors/:id
  */
  app.route('/v2/actors/:id')
    .get(readActor)
    .put(
      verifyUser(Object.values(RoleEnum)),
      updateActor
    ).delete(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      deleteActor
    )

  /**
   * Ban an actor
   *   RequiredRoles: to be administrator
   * @section actors
   * @type patch
   * @url /v2/actors/:id/ban
   */
  app.route('/v2/actors/:id/ban')
    .patch(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      banActor
    )

  /**
   * Unban an actor
   *  RequiredRoles: to be administrator
   * @section actors
   * @type patch
   * @url /v2/actors/:id/unban
   */
  app.route('/v2/actors/:id/unban')
    .patch(
      verifyUser([RoleEnum.ADMINISTRATOR]),
      unbanActor
    )

}