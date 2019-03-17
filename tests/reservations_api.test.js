const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Reservation = require('../models/reservation')

const api = supertest(app)

describe('when there is initially some reservations saved', () => {
  beforeEach(async () => {
    await Reservation.remove({})

    const reservationObjects = helper.initialReservations.map(reservation => new Reservation(reservation))
    const promiseArray = reservationObjects.map(reservation => reservation.save())
    await Promise.all(promiseArray)
  })

  test('all reservations are returned', async () => {
    const response = await api.get('/api/reservations')

    expect(response.body.length).toBe(helper.initialReservations.length)
  })

  test('a valid id field is generated', async () => {
    const response = await api.get('/api/reservations')

    expect(response.body[0].id).toBeDefined()
  })

  describe('addition of a new reservation', () => {

    test('a reservation can be added', async () => {
      const newReservation = {
        name: 'Test tseT',
        startTime: '2019-03-13T15:00:00.000Z',
        endTime: '2019-03-13T16:00:00.000Z',
        active: true,
      }

      await api
        .post('/api/reservations')
        .send(newReservation)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length + 1)

      const names = reservationsAtEnd.map(b => b.name)
      expect(names).toContain('Test tseT')
    })

    test('fails with status code 400 if data is invalid', async () => {
      const newReservation = {
        active: true,
      }

      await api
        .post('/api/reservations')
        .send(newReservation)
        .expect(400)

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length)
    })

    test('')

  })

  test('a reservation can be deleted', async () => {
    const reservationsAtStart = await helper.reservationsInDb()
    const reservationToDelete = reservationsAtStart[0]

    await api
      .delete(`/api/reservations/${reservationToDelete.id}`)
      .expect(204)

    const reservationsAtEnd = await helper.reservationsInDb()
    expect(reservationsAtEnd.length).toBe(helper.initialReservations.length - 1)

    const names = reservationsAtEnd.map(r => r.name)
    expect(names).not.toContain(reservationToDelete.name)
  })

})

afterAll(() => {
  mongoose.connection.close()
})
