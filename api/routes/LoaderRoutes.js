import * as loaderController from '../controllers/LoaderController.js'

export default function (app) {

  /*
  *
  * Put a large json with documents from a file into a collection of mongoDB
  *
  * @section loader
  * @type post
  * @url /v1/loader/insertMany
  * @param {string} model  //mandatory
  * @param {string} sourceFile   //mandatory
  * Sample 1 (actors): http://localhost:8080/v1/loader/insertMany?model=Actor&sourceFile=file://c:/temp/Actors.json
  */
  app.route('/v1/loader/insertMany')
    .post(loaderController.storeJsonInsertMany)

}