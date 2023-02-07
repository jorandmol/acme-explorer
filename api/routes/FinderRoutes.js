import { listFinders, createFinder, readFinder, updateFinder, deleteFinder } from '../controllers/FinderController.js'
import { creationValidator } from '../controllers/validators/FinderValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {
  /**
  * Get an finder
  *    Required role: Explorer (its own finder)
  * Post an finder
  *    RequiredRoles: Explorer
  *
  * @section finders
  * @type get post
  * @url /v1/finders
  */
  app.route('/v1/finders')
    .get(listFinders)
    .post(
      creationValidator,
      handleExpressValidation,
      createFinder
    )

  /**
  * Put an finder
  *    RequiredRoles: Explorer (its own finder)
  * Get an finder
  *    RequiredRoles: Explorer (its own finder)
  *
  * @section finders
  * @type get put
  * @url /v1/finders/:id
  */
  app.route('/v1/finders/:id')
    .get(readFinder)
    .put(updateFinder)
    .delete(deleteFinder)

}