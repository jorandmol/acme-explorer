import { login } from '../controllers/ActorController.js';

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
    .post(login)
}