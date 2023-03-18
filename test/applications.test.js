import app from '../app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'
import Trip from '../api/models/TripModel.js'
import Application from '../api/models/ApplicationModel.js'
import Actor from '../api/models/ActorModel.js'
import { ObjectId } from 'mongodb';
import RoleEnum from '../api/enum/RoleEnum.js'
import StatusEnum from '../api/enum/StatusEnum.js'

const PATH = '/v1/applications'

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

describe('Applications', () => {

  describe('GET /applications', () => {
    const endpoint = '/v1/applications'
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(explorer1))
      sinon.stub(Application, 'aggregate').returns(Promise.resolve([ { _id: StatusEnum.PENDING, applications: [appl1] } ]))
      chai
        .request(app)
        .get(endpoint)
        .set({ actor_id: explorer1._id.toString() })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.length).to.be.eq(1)
          done()
        })
    })
    it('Should return 403', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(manager1))
      chai
        .request(app)
        .get(endpoint)
        .set({ actor_id: manager1._id.toString() })
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
        .set({ actor_id: 'pepe_elmarismeño' })
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('POST /applications', () => {
    const endpoint = '/v1/applications'
    const { _id, ...body} = appl1
    it('Should return OK', done => {
      sinon.stub(Application, 'alreadyExists').returns(false)
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application.prototype, 'save').returns(Promise.resolve(appl1))
      chai
        .request(app)
        .post(endpoint)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.explorer).to.be.eq(explorer1._id.toString())
          done()
        })
    })
    it('Should return 409', done => {
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application, 'alreadyExists').returns(true)
      chai
        .request(app)
        .post(endpoint)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(409)
          done()
        })
    })
    it('Should return 422', done => {
      const { _id, explorer, ...badBody} = appl1
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application, 'alreadyExists').returns(false)
      chai
        .request(app)
        .post(endpoint)
        .send(badBody)
        .end((err, res) => {
          expect(res).to.have.status(422)
          done()
        })
    })
  })

  describe('GET /applications/:id', () => {
    const endpoint = '/v1/applications/'
    it('Should return OK', done => {
      sinon.stub(Application, 'findById').returns(Promise.resolve(appl1))
      chai
        .request(app)
        .get(endpoint + appl1._id.toString())
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body._id).to.be.eq(appl1._id.toString())
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Application, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .get(endpoint + '404')
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('PATCH /applications/:id/cancel', () => {
    const endpoint = '/v1/applications/'
    it('Should return OK', done => {
      const result = { ...appl1, status: StatusEnum.CANCELLED, cancellationDate: new Date(), cancellationReason: 'LOL' }
      sinon.stub(Application, 'findById').returns(Promise.resolve(new Application(appl1)))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application.prototype, 'save').returns(Promise.resolve(result))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/cancel')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.status).to.be.eq(StatusEnum.CANCELLED)
          done()
        })
    })
    it('Should return 500', done => {
      sinon.stub(Application, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .patch(endpoint + '500' + '/cancel')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })
    it('Should return 422', done => {
      const rejectedAppl = { ...appl1, status: StatusEnum.REJECTED }
      sinon.stub(Application, 'findById').returns(Promise.resolve(rejectedAppl))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/cancel')
        .end((err, res) => {
          expect(res).to.have.status(422)
          expect(res.body.message).to.be.eq(`Application status is ${StatusEnum.REJECTED.toUpperCase()}, it must be PENDING, DUE or ACCEPTED`)
          done()
        })
    })
  })

  describe('PATCH /applications/:id/accept', () => {
    const endpoint = '/v1/applications/'
    it('Should return OK', done => {
      const result = { ...appl1, status: StatusEnum.DUE }
      sinon.stub(Application, 'findById').returns(Promise.resolve(new Application(appl1)))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application.prototype, 'save').returns(Promise.resolve(result))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/accept')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.status).to.be.eq(StatusEnum.DUE)
          done()
        })
    })
    it('Should return 500', done => {
      sinon.stub(Application, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .patch(endpoint + '500' + '/accept')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })
    it('Should return 422', done => {
      const rejectedAppl = { ...appl1, status: StatusEnum.REJECTED }
      sinon.stub(Application, 'findById').returns(Promise.resolve(rejectedAppl))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/accept')
        .end((err, res) => {
          expect(res).to.have.status(422)
          expect(res.body.message).to.be.eq(`Application status is ${StatusEnum.REJECTED.toUpperCase()}, it must be PENDING`)
          done()
        })
    })
  })

  describe('PATCH /applications/:id/reject', () => {
    const endpoint = '/v1/applications/'
    const rejectionReason = 'TESSSSSSSSSSSSSSSSST'
    it('Should return OK', done => {
      const result = { ...appl1, status: StatusEnum.REJECTED }
      sinon.stub(Application, 'findById').returns(Promise.resolve(new Application(appl1)))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application.prototype, 'save').returns(Promise.resolve(result))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/reject')
        .send({ rejectionReason })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.status).to.be.eq(StatusEnum.REJECTED)
          done()
        })
    })
    it('Should return 500', done => {
      sinon.stub(Application, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .patch(endpoint + '500' + '/reject')
        .send({ rejectionReason })
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })
    it('Should return 422', done => {
      const rejectedAppl = { ...appl1, status: StatusEnum.REJECTED }
      sinon.stub(Application, 'findById').returns(Promise.resolve(rejectedAppl))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/reject')
        .send({ rejectionReason })
        .end((err, res) => {
          expect(res).to.have.status(422)
          expect(res.body.message).to.be.eq(`Application status is ${StatusEnum.REJECTED.toUpperCase()}, it must be PENDING`)
          done()
        })
    })
  })

  describe('PATCH /applications/:id/pay', () => {
    const endpoint = '/v1/applications/'
    it('Should return OK', done => {
      const dueApp = new Application({ ...appl1, status: StatusEnum.DUE })
      const result = { ...appl1, status: StatusEnum.ACCEPTED }
      sinon.stub(Application, 'findById').returns(Promise.resolve(dueApp))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application.prototype, 'save').returns(Promise.resolve(result))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/pay')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.status).to.be.eq(StatusEnum.ACCEPTED)
          done()
        })
    })
    it('Should return 500', done => {
      sinon.stub(Application, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .patch(endpoint + '500' + '/pay')
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })
    it('Should return 422', done => {
      const rejectedAppl = { ...appl1, status: StatusEnum.REJECTED }
      sinon.stub(Application, 'findById').returns(Promise.resolve(rejectedAppl))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/pay')
        .end((err, res) => {
          expect(res).to.have.status(422)
          expect(res.body.message).to.be.eq(`Application status is ${StatusEnum.REJECTED.toUpperCase()}, it must be DUE`)
          done()
        })
    })
  })

  describe('PATCH /applications/:id/comments', () => {
    const endpoint = '/v1/applications/'
    const comments = 'LOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLO'
    it('Should return OK', done => {
      const result = { ...appl1, comments }
      sinon.stub(Application, 'findById').returns(Promise.resolve(new Application(appl1)))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      sinon.stub(Application.prototype, 'save').returns(Promise.resolve(result))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/comments')
        .send({ comments })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.comments).to.be.eq(comments)
          done()
        })
    })
    it('Should return 500', done => {
      sinon.stub(Application, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .patch(endpoint + '500' + '/comments')
        .send({ comments })
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })
    it('Should return 422', done => {
      const rejectedAppl = { ...appl1, status: StatusEnum.REJECTED }
      sinon.stub(Application, 'findById').returns(Promise.resolve(rejectedAppl))
      sinon.stub(Trip, 'findById').returns(Promise.resolve(trip1))
      chai
        .request(app)
        .patch(endpoint + appl1._id.toString() + '/comments')
        .send({ comments })
        .end((err, res) => {
          expect(res).to.have.status(422)
          expect(res.body.message).to.be.eq(`Application status is ${StatusEnum.REJECTED.toUpperCase()}, it must be PENDING`)
          done()
        })
    })
  })

  afterEach(() => {
    sinon.reset()
    sinon.restore()
  })
})