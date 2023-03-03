import app from '../app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'

const { expect } = chai
chai.use(chaiHttp)
describe('TEST', () => {
  it('Welcomes user to the API', done => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.text).to.equals('Welcome to ACME-Explorer RESTful API')
        done()
      })
  })
})