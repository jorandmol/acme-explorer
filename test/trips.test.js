import app from '../app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'
import Trip from '../api/models/TripModel.js'

const PATH = '/v1/trips'

const { expect } = chai
chai.use(chaiHttp)
describe('Trips', () => {
  let endpoint;
  describe('/search', () => {
    endpoint = '/v1/search'
    it('Should return OK', done => {
      const findStub = sinon.stub(Trip, "find").returns(JSON.stringify({}))
      // TODO: Mirar esto https://stackoverflow.com/questions/54920719/how-to-stub-mongoose-methods-with-multiple-arguments-in-sinon
      const limitStub = sinon.stub(Trip, "limit").returns(JSON.stringify({ limit: 0 }))
      chai
        .request(app)
        .get(endpoint)
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
    })

  })

})