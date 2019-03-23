const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Reservation = require('../models/reservation')
const Room = require('../models/room')
const User = require('../models/user')

const api = supertest(app)

jest.mock('node-telegram-bot-api')

describe('when there is initially some reservations saved', () => {
  beforeEach(async () => {
    await Room.remove({})
    const roomObjects = helper.initialRooms.map(room => new Room(room))
    const roomsPromiseArray = roomObjects.map(room => room.save())
    await Promise.all(roomsPromiseArray)

    await User.remove({})
    const userObjects = helper.initialUsers.map(user => new User(user))
    const usersPromiseArray = userObjects.map(user => user.save())
    await Promise.all(usersPromiseArray)

    await Reservation.remove({})
    const reservationObjects = helper.initialReservations.map(reservation => new Reservation(reservation))

    const inactiveReservations = reservationObjects.splice(0, 2)
    const inactiveReservationsPromiseArray = inactiveReservations.map(reservation => reservation.save({ validateBeforeSave: false }))
    await Promise.all(inactiveReservationsPromiseArray)

    const reservationsPromiseArray = reservationObjects.map(reservation => reservation.save())
    await Promise.all(reservationsPromiseArray)
  })

  test('all reservations are returned', async () => {
    const response = await api.get('/api/reservations/all')
    expect(response.body.length).toBe(helper.initialReservations.length)
  })

  test('active reservations are returned', async () => {
    const response = await api.get('/api/reservations')

    response.body.forEach((reservation) => {
      expect(new Date(reservation.endTime).getTime()).toBeGreaterThanOrEqual(new Date().getTime())
    })
  })

  test('a valid id field is generated', async () => {
    const response = await api.get('/api/reservations')

    expect(response.body[0].id).toBeDefined()
  })

  describe('addition of a new reservation', () => {

    test('a reservation can be added', async () => {
      const newReservation = {
        name: 'Test tseT',
        username: 'TheBadMF',
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[0]

      await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length + 1)

      const names = reservationsAtEnd.map(b => b.name)
      expect(names).toContain('Test tseT')
    })

    test('a reservation can be added with default values', async () => {
      const newReservation = {
        name: 'Test tseT',
        username: 'TheBadMF',
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[0]

      const result = await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(result.body.startTime).toBeDefined()
      expect(result.body.endTime).toBeDefined()

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length + 1)

      const names = reservationsAtEnd.map(b => b.name)
      expect(names).toContain('Test tseT')
    })

    test('fails with status code 400 if data is invalid', async () => {
      const newReservation = {
        username: 'TheBadMF',
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[0]

      await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation)
        .expect(400)

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length)
    })

    test('creation fails with proper statuscode and message if end time has passed', async () => {
      const newReservation = {
        name: 'End time in the past',
        startTime: new Date(Date.now() - (1000 * 60 * 61)),
        endTime: new Date(Date.now() - (1000 * 60)),
        username: 'TheBadMF',
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[0]

      const result = await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation)
        .expect(400)

      expect(result.body.error).toContain('is before minimum allowed value')

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length)
    })

    test('creation fails if start time greater than end date', async () => {
      const newReservation = {
        name: 'Test tseT',
        startTime: new Date(Date.now() + (1000 * 61 * 60)),
        endTime: new Date(Date.now() + (1000 * 60 * 60)),
        username: 'TheBadMF',
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[0]

      const result = await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation)
        .expect(400)

      expect(result.body.error).toContain('startTime must be less than endTime')

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length)
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newReservation = {
        name: 'Test tseT',
        startTime: Date.now(),
        endTime: new Date(Date.now() + (1000 * 60 * 60)),
        username: 'Stu Dent',
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[0]

      await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newReservation.username)
    })

    test('creation succeeds with an existing username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newReservation = {
        name: 'Test tseT',
        startTime: Date.now(),
        endTime: new Date(Date.now() + (1000 * 60 * 60)),
        username: 'TheBadMF',
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[0]

      await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newReservation.username)
    })

    test('creation fails with proper statuscode and message if nonexisting room id provided', async () => {
      const nonExistingRoomId = mongoose.Types.ObjectId(/*'56cb91bdc3464f14678934ca'*/)

      const newReservation = {
        name: 'Test tseT',
        username: 'TheBadMF',
      }

      const result = await api
        .post(`/api/rooms/${nonExistingRoomId}/reservation`)
        .send(newReservation)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('room not found')

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length)
    })

    test('room has only one active reservation at a time', async () => {
      const newReservation1 = {
        name: 'Double booking like a biz wiz',
        username: 'TheBadMF',
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[roomsAtStart.length - 1]

      await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation1)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      let reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length + 1)

      const names = reservationsAtEnd.map(b => b.name)
      expect(names).toContain('Double booking like a biz wiz')

      const newReservation2 = {
        name: 'Double booking like a biz wiz remix',
        username: 'Stu Dent',
      }

      const result = await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation2)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('room is full')

      reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length + 1)
    })

    test('creation fails with proper statuscode and message if no username provided', async () => {
      const usersAtStart = await helper.usersInDb()

      const newReservation = {
        name: 'Test tseT',
        startTime: Date.now(),
        endTime: new Date(Date.now() + (1000 * 60 * 60)),
      }

      const roomsAtStart = await helper.roomsInDb()
      const room = roomsAtStart[0]

      const result = await api
        .post(`/api/rooms/${room.id}/reservation`)
        .send(newReservation)
        .expect(401)

      expect(result.body.error).toContain('username missing')

      const reservationsAtEnd = await helper.reservationsInDb()
      expect(reservationsAtEnd.length).toBe(helper.initialReservations.length)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

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

describe('rooms', () => {
  beforeEach(async () => {
    await Room.remove({})
    const roomObjects = helper.initialRooms.map(room => new Room(room))
    const roomsPromiseArray = roomObjects.map(room => room.save())
    await Promise.all(roomsPromiseArray)
  })

  test('all rooms are returned', async () => {
    const response = await api.get('/api/rooms')
    expect(response.body.length).toBe(helper.initialRooms.length)
  })

  test('return room when searched with valid code', async () => {
    const roomCode = '420'
    const response = await api.get(`/api/rooms/${roomCode}`)
    expect(response.body.code).toBe(roomCode)
  })

  test('return error when room search with invalid code', async () => {
    const roomCode = 'NaN'
    const response = await api
      .get(`/api/rooms/${roomCode}`)
      .expect(400)

    expect(response.body.error).toContain('room not found')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
