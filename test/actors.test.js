import app from '../app.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'
import Actor from '../api/models/ActorModel.js'
import { ObjectId } from 'mongodb';
import RoleEnum from '../api/enum/RoleEnum.js'

const actor1 = {
  _id: ObjectId('63ed27e9820b1504a034abb2'),
  name: 'Middleton',
  surname: 'Bolton',
  email: 'middletonbolton@gmail.com',
  password: '771ecb02-4d4b',
  phone: '+572 101552442',
  address: '36 Times Placez, Forestburg, North Dakota',
  role: RoleEnum.ADMINISTRATOR,
  __v: 0,
  createdAt: new Date('2023-02-15T18:44:54.375Z'),
  updatedAt: new Date('2023-02-15T18:44:54.375Z')
}
const actor2 = {
  _id: ObjectId('63ed27e9db335a31d53ee505'),
  name: 'Dionne',
  surname: 'Aguilar',
  email: 'dionneaguilar@gmail.com',
  password: 'e11ae82c-488e',
  phone: '+666 224536329',
  address: '100 Drew Street, Sutton, Indiana',
  role: RoleEnum.SPONSOR,
  __v: 0,
  createdAt: new Date('2023-02-15T18:44:54.374Z'),
  updatedAt: new Date('2023-02-15T18:44:54.374Z')
}

const { expect } = chai
chai.use(chaiHttp)

describe('Actors', () => {

  describe('GET /actors', () => {
    const endpoint = '/v1/actors'
    it('Should return OK', done => {
      sinon.stub(Actor, 'find').returns(Promise.resolve([actor1, actor2]))
      chai
        .request(app)
        .get(endpoint)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.length).to.be.eq(2)
          done()
        })
    })
    it('Should return 500', done => {
      sinon.stub(Actor, 'find').throws(new Error('error'))
      chai
        .request(app)
        .get(endpoint)
        .end((err, res) => {
          expect(res).to.have.status(500)
          done()
        })
    })
  })

  describe('POST /actors', () => {
    const endpoint = '/v1/actors'
    const { _id, ...body} = actor1
    it('Should return OK', done => {
      sinon.stub(Actor.prototype, 'save').returns(Promise.resolve(actor1))
      chai
        .request(app)
        .post(endpoint)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.email).to.be.eq(actor1.email)
          done()
        })
    })
    it('Should return 422', done => {
      const { _id, email, ...badBody} = actor1
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

  describe('GET /actors/:id', () => {
    const endpoint = '/v1/actors/'
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(actor2))
      chai
        .request(app)
        .get(endpoint + actor2._id.toString())
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body._id).to.be.eq(actor2._id.toString())
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .get(endpoint + '404')
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('PUT /actors/:id', () => {
    const endpoint = '/v1/actors/'
    const { _id, ...body} = actor1
    body.email = 'sinamapongole@hotmail.com'
    const result = { ...actor1, email: 'sinamapongole@hotmail.com' }
    it('Should return OK', done => {
      sinon.stub(Actor, 'findOneAndUpdate').returns(Promise.resolve(result))
      chai
        .request(app)
        .put(endpoint + actor1._id.toString())
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.email).to.be.eq('sinamapongole@hotmail.com')
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findOneAndUpdate').returns(Promise.resolve(null))
      chai
        .request(app)
        .put(endpoint + '404')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
    it('Should return 422', done => {
      const { email, ...badBody } = body
      sinon.stub(Actor, 'findOneAndUpdate').rejects({ message: 'KO', name: 'ValidationError' })
      chai
        .request(app)
        .put(endpoint + actor2._id.toString())
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(422)
          done()
        })
    })
  })

  describe('DELETE /actors/:id', () => {
    const endpoint = '/v1/actors/'
    it('Should return OK', done => {
      sinon.stub(Actor, 'deleteOne').returns(Promise.resolve({ deletedCount: 1 }))
      chai
        .request(app)
        .delete(endpoint + actor1._id.toString())
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'deleteOne').returns(Promise.resolve({ deletedCount: 0 }))
      chai
        .request(app)
        .delete(endpoint + '404')
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('PATCH /actors/:id/ban', () => {
    const endpoint = '/v1/actors/'
    const reason = 'Fraude fiscal'
    const body = { date: new Date(), reason }
    it('Should return OK', done => {
      const result = { ...actor1, ban: body }
      sinon.stub(Actor, 'findById').returns(Promise.resolve(new Actor(actor1)))
      sinon.stub(Actor.prototype, 'save').returns(Promise.resolve(result))
      chai
        .request(app)
        .patch(endpoint + actor1._id.toString() + '/ban')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.ban.reason).to.be.eq(reason)
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .delete(endpoint + '404' + '/ban')
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })
  })

  describe('PATCH /actors/:id/unban', () => {
    const endpoint = '/v1/actors/'
    it('Should return OK', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(new Actor(actor1)))
      sinon.stub(Actor.prototype, 'save').returns(Promise.resolve(actor1))
      chai
        .request(app)
        .patch(endpoint + actor1._id.toString() + '/unban')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body.ban).to.be.eq(undefined)
          done()
        })
    })
    it('Should return 404', done => {
      sinon.stub(Actor, 'findById').returns(Promise.resolve(null))
      chai
        .request(app)
        .delete(endpoint + '404' + '/unban')
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