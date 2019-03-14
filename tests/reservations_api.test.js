const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Reservation = require('../models/reservation')

const api = supertest(app)

describe('reservations', () => {
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

  test('a reservation can be added', async () => {
    // TODO
    expect(true).toBe(true)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
