const UserService = require('./user.service')

const mockStore = {
  users: {
    findOrCreate: jest.fn(),
    findAll: jest.fn()
  },
  trips: {
    findOrCreate: jest.fn()
  }
}
const user = { id: 1, email: 'user@example.com' }

const db = new UserService({ store: mockStore })

describe('[User Service]', () => {
  describe('FindOrCreateUser', () => {
    it('invalid email returns null', async () => {
      const email = 'fake'
      const record = await db.findOrCreateUser({ email })
      expect(record).toBeNull()
    })

    it('no user found/created returns null ', async () => {
      const email = 'user@example.com'
      const record = await db.findOrCreateUser({ email })
      expect(record).toBeNull()
    })

    it('looks up / creates user in store', async () => {
      const { id, email } = user
      const { findOrCreate } = mockStore.users
      findOrCreate.mockReturnValueOnce([{ id }])

      const record = await db.findOrCreateUser(user)

      expect(findOrCreate).toHaveBeenCalledWith({ where: { email } })
      expect(record).toEqual({ id })
    })
  })

  describe('Book Trip', () => {
    const launchId = 1
    const { id: userId } = user
    const { findOrCreate } = mockStore.trips

    afterEach(() => findOrCreate.mockReset())

    test('no user returns null', async () => {
      const record = await db.bookTrip({ launchId })
      expect(record).toBeFalsy()
    })

    test('book a trip', async () => {
      db.initialize({ context: { user } }) // Set User

      findOrCreate.mockReturnValueOnce([{ get: () => 'result' }])

      const record = await db.bookTrip({ launchId })

      expect(findOrCreate).toHaveBeenCalledTimes(1)
      expect(findOrCreate).toHaveBeenCalledWith({ where: { launchId, userId } })
      expect(record).toBeTruthy()

      db.initialize({ context: null }) // Clear user
    })
  })

  describe('Book Trips', () => {
    const { findOrCreate } = mockStore.trips
    const launchIds = [1, 3]
    const userId = user.id

    afterEach(() => findOrCreate.mockReset())

    test('no user returns false', async () => {
      const record = await db.bookTrips({ launchIds })
      expect(record).toBeFalsy()
    })

    test('books multiple trips', async () => {
      db.initialize({ context: { user } }) // Set User

      findOrCreate.mockReturnValue([{ get: () => 'record' }])

      const record = await db.bookTrips({ launchIds })

      expect(findOrCreate).toHaveBeenCalledTimes(2)

      expect(findOrCreate).toHaveBeenCalledWith({
        where: { launchId: launchIds[0], userId }
      })

      expect(record).toEqual(expect.arrayContaining(['record']))

      db.initialize({ context: null }) // Clear user
    })
  })

  describe('Cancel Trip', () => {
    test.todo('no user returns false')
    test.todo('cancels a trip')
  })

  describe('Get Launch Ids By User', () => {
    test.todo('no user returns false')
    test.todo('retrieves all trips for a user')
  })

  describe('Is Booked On Launch', () => {
    test.todo('no user returns false')
    test.todo('verifies user is booked on a trip')
  })
})

module.exports.mockStore = mockStore
