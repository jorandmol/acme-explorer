import app from '../app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'
import Trip from '../api/models/TripModel.js'
import Application from '../api/models/ApplicationModel.js'
import Actor from '../api/models/ActorModel.js'
import GlobalConfig from '../api/models/GlobalConfigModel.js'
import { ObjectId } from 'mongodb';
import RoleEnum from '../api/enum/RoleEnum.js'
import StatusEnum from '../api/enum/StatusEnum.js'

const PATH = '/v1/trips'

const manager1 = {
  _id: ObjectId('63ed27e96f6eb8680cc0b162'),
  role: RoleEnum.MANAGER
}
const explorer1 = {
  _id: ObjectId('63ed27e96f6eb8680cc0b163'),
  role: RoleEnum.EXPLORER
}
const trip1 = {
  _id: ObjectId('63f38c8febcc5d77c3637ba6'),
  creator: ObjectId('63ed27e96f6eb8680cc0b162'),
  title: 'Trip Title',
  description: 'description2',
  price: 500,
  requirements: 'reequirements2',
  startDate: new Date('2023-07-10T00:00:00.000Z'),
  endDate: new Date('2023-07-15T00:00:00.000Z'),
  publicationDate: null,
  cancellationDate: null,
  cancellationReason: null,
  pictures: [],
  stages: [],
  sponsorships: [],
  createdAt: '2023-02-20T15:06:55.168Z',
  updatedAt: '2023-02-20T15:06:55.168Z',
  ticker: '230220-CWLW',
  __v: 0
}
const appl1 = {
  rejectionReason: null,
  paidAt: null,
  _id: ObjectId('63ed2787c617b43b603f7a5f'),
  explorer: ObjectId('63ed27e96f6eb8680cc0b163'),
  trip: ObjectId('63f38c8febcc5d77c3637ba6'),
  status: StatusEnum.PENDING,
  cancellationDate: null,
  cancellationReason: null,
  comments: 'I have to take this opportunity to visit this place. It\'s now or never!',
  __v: 0,
  createdAt: new Date('2023-02-15T18:45:10.272Z'),
  updatedAt: new Date('2023-02-15T18:45:10.272Z')
}

const { expect } = chai
chai.use(chaiHttp)

describe('Trips', () => {

  describe('GET /search', () => {
    const endpoint = '/v1/search'
    it('Should return OK', done => {
      sinon.stub(GlobalConfig, 'findOne').returns(Promise.resolve({ numResults: 10 }))
      sinon.stub(Trip, 'findByFilters').returns(Promise.resolve([trip1]))
      chai
        .request(app)
        .get(endpoint)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.length).to.be.eq(1)
          done()
        })
    })
    it('Should return 500', done => {
      sinon.stub(GlobalConfig, 'findOne').returns(Promise.resolve({ numResults: 10 }))
      sinon.stub(Trip, 'findByFilters').throws(new Error('error'))
      chai
        .request(app)
        .get(endpoint)
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })

  })

  describe('GET /trips', () => {
    const endpoint = '/v1/trips'
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'find').returns(Promise.resolve([trip1]))
      chai
        .request(app)
        .get(endpoint)
        .set({ actor_id: manager1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.length).to.be.eq(1)
          done()
        })
    })
    it('Should return 403', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      chai
        .request(app)
        .get(endpoint)
        .set({ actor_id: explorer1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(403)
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .get(endpoint)
        .set({ actor_id: explorer1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('POST /trips', () => {
    const endpoint = '/v1/trips'
    const { _id, ...body} = trip1
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip.prototype, 'save').returns(Promise.resolve(trip1))
      chai
        .request(app)
        .post(endpoint)
        .set({ actor_id: manager1._id.toString() })
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.creator).to.be.eq(trip1.creator.toString())
          done()
        })
    })
    it('Should return 403', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      chai
        .request(app)
        .post(endpoint)
        .set({ actor_id: explorer1._id.toString() })
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(403)
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .post(endpoint)
        .set({ actor_id: explorer1._id.toString() })
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('GET /trips/:id', () => {
    const endpoint = '/v1/trips/'
    it('Should return OK', done => {
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      chai
        .request(app)
        .get(endpoint + trip1._id.toString())
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body._id).to.be.eq(trip1._id.toString())
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Trip, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .get(endpoint + '404')
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })

  })

  describe('PUT /trips/:id', () => {
    const endpoint = '/v1/trips/'
    const { _id, ...body} = trip1
    body.price = 33
    const result = { ...trip1, price: 33 }
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Trip, 'findOneAndUpdate').returns(Promise.resolve(result))
      chai
        .request(app)
        .put(endpoint + trip1._id.toString())
        .set({ actor_id: manager1._id.toString() })
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.price).to.be.eq(33)
          done()
        })
    })
    it('Should return 403', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      chai
        .request(app)
        .put(endpoint + trip1._id.toString())
        .set({ actor_id: explorer1._id.toString() })
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(403)
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .put(endpoint + '404')
        .set({ actor_id: explorer1._id.toString() })
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
    it('Should return 422', done => {
      const publishedTrip = { ...trip1, publicationDate: new Date() }
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(publishedTrip))
      chai
        .request(app)
        .put(endpoint + trip1._id.toString())
        .set({ actor_id: explorer1._id.toString() })
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(422)
          done()
        })
    })
  })

  describe('DELETE /trips/:id', () => {
    const endpoint = '/v1/trips/'
    const deletionResponse = { deletedCount: 1 }
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Trip, 'deleteOne').returns(Promise.resolve(deletionResponse))
      chai
        .request(app)
        .delete(endpoint + trip1._id.toString())
        .set({ actor_id: manager1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
    })
    it('Should return 403', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      chai
        .request(app)
        .delete(endpoint + trip1._id.toString())
        .set({ actor_id: explorer1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(403)
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .delete(endpoint + '404')
        .set({ actor_id: explorer1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
    it('Should return 422', done => {
      const publishedTrip = { ...trip1, publicationDate: new Date() }
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(publishedTrip))
      chai
        .request(app)
        .delete(endpoint + trip1._id.toString())
        .set({ actor_id: explorer1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(422)
          done()
        })
    })
  })

  describe('PATCH /trips/:id/publish', () => {
    const endpoint = '/v1/trips/'
    const publicationDate = new Date('2099-01-01')
    const result = { ...trip1, publicationDate }
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Trip, 'findOneAndUpdate').returns(Promise.resolve(result))
      chai
        .request(app)
        .patch(endpoint + trip1._id.toString() + '/publish')
        .set({ actor_id: manager1._id.toString() })
        .send({ publicationDate: publicationDate })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(new Date(res.body.publicationDate).getDate()).to.be.eq(publicationDate.getDate())
          done()
        })
    })
    it('Should return 403', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      chai
        .request(app)
        .patch(endpoint + trip1._id.toString() + '/publish')
        .set({ actor_id: explorer1._id.toString() })
        .send({ publicationDate: publicationDate })
        .end((err, res) => {
          expect(res).to.have.status(403)
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .patch(endpoint + '404' + '/publish')
        .set({ actor_id: explorer1._id.toString() })
        .send({ publicationDate: publicationDate })
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
    it('Should return 422', done => {
      const publishedTrip = { ...trip1, publicationDate: new Date() }
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(publishedTrip))
      chai
        .request(app)
        .patch(endpoint + trip1._id.toString() + '/publish')
        .set({ actor_id: explorer1._id.toString() })
        .send({ publicationDate: publicationDate })
        .end((err, res) => {
          expect(res).to.have.status(422)
          done()
        })
    })
  })

  describe('PATCH /trips/:id/cancel', () => {
    const endpoint = '/v1/trips/'
    const publishedTrip = { ...trip1, publicationDate: new Date('2023-01-01') }
    const cancellationReason = 'TEST|TEST|TEST|TEST|TEST|TEST|TEST|TEST|TEST'
    const result = { ...trip1, cancellationReason, cancellationDate: new Date() }
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(publishedTrip))
      sinon.stub(Trip, 'findOneAndUpdate').returns(Promise.resolve(result))
      chai
        .request(app)
        .patch(endpoint + publishedTrip._id.toString() + '/cancel')
        .set({ actor_id: manager1._id.toString() })
        .send({ cancellationReason })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.cancellationReason).to.be.eq(cancellationReason)
          done()
        })
    })
    it('Should return 403', done => {
      const actorStub = sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      chai
        .request(app)
        .patch(endpoint + publishedTrip._id.toString() + '/cancel')
        .set({ actor_id: explorer1._id.toString() })
        .send({ cancellationReason })
        .end((err, res) => {
          expect(res).to.have.status(403)
          done()
        })
    })
    it('Should return 404', done => {
      const actorStub = sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      const idStub = sinon.stub(Trip, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .patch(endpoint + '404' + '/cancel')
        .set({ actor_id: explorer1._id.toString() })
        .send({ cancellationReason })
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
    it('Should return 422', done => {
      const canceledTrip = { ...publishedTrip, cancellationReason: new Date() }
      const actorStub = sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      const idStub = sinon.stub(Trip, 'findById').returns(Promise.resolve(canceledTrip))
      chai
        .request(app)
        .patch(endpoint + publishedTrip._id.toString() + '/cancel')
        .set({ actor_id: explorer1._id.toString() })
        .send({ cancellationReason })
        .end((err, res) => {
          expect(res).to.have.status(422)
          expect(res.text).to.be.eq('The trip has already been cancelled')
          done()
        })
    })
  })

  describe('GET /trips/:id/applications', () => {
    const endpoint = '/v1/trips/'
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application, 'find').returns(Promise.resolve([appl1]))
      chai
        .request(app)
        .get(endpoint + trip1._id.toString() + '/applications')
        .set({ actor_id: manager1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.length).to.be.eq(1)
          done()
        })
    })
    it('Should return 403', done => {
      const manager2 = { ...manager1, _id: ObjectId('63ed2787c617b43b603f7a5d')}
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager2))
      chai
        .request(app)
        .get(endpoint + trip1._id.toString() + '/applications')
        .set({ actor_id: explorer1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(403)
          expect(res.text).to.be.eq('Actor does not have the required permissions')
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .get(endpoint + '404' + '/applications')
        .set({ actor_id: explorer1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('POST /trips/:id/applications', () => {
    const endpoint = '/v1/trips/'
    const comments = 'Comments'
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application.prototype, 'save').returns(Promise.resolve(appl1))
      sinon.stub(Application, 'find').returns(Promise.resolve([]))
      chai
        .request(app)
        .post(endpoint + trip1._id.toString() + '/applications')
        .set({ actor_id: manager1._id.toString() })
        .send(comments)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.trip).to.be.eq(trip1._id.toString())
          done()
        })
    })
    it('Should return 403', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      sinon.stub(Application, 'find').returns(Promise.resolve([appl1]))
      chai
        .request(app)
        .post(endpoint + trip1._id.toString() + '/applications')
        .set({ actor_id: explorer1._id.toString() })
        .send(comments)
        .end((err, res) => {
          expect(res).to.have.status(403)
          expect(res.text).to.be.eq('There is already another application created by you')
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .post(endpoint + '404' + '/applications')
        .set({ actor_id: explorer1._id.toString() })
        .send(comments)
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  afterEach(() => {
    sinon.reset()
    sinon.restore()
  })
})