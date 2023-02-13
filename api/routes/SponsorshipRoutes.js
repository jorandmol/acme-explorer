import { listSponsorships, createSponsorship, readSponsorship, updateSponsorship, deleteSponsorship } from '../controllers/SponsorshipController.js'
import { creationValidator, updateValidator } from '../controllers/validators/SponsorshipValidator.js'
import handleExpressValidation from '../middlewares/ValidationHandlingMiddleware.js'

export default function (app) {
  /**
  * Get sponsorships
  *    Required role: Sponsor, Manager or Administator
  * Post a sponsorship
  *    RequiredRoles: Sponsor
  *
  * @section sponsorships
  * @type get post
  * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
    .get(listSponsorships)
    .post(
      creationValidator,
      handleExpressValidation,
      createSponsorship
    )

  /**
  * Put a sponsorship
  *    RequiredRoles: Sponsor
  * Get a sponsorship
  *    RequiredRoles: Sponsor, Manager or Administator
  *
  * @section sponsorships
  * @type get put
  * @url /v1/sponsorships/:id
  */
  app.route('/v1/sponsorships/:id')
    .get(readSponsorship)
    .put(
      updateValidator,
      handleExpressValidation,
      updateSponsorship
    )
    .delete(deleteSponsorship)

}