const UserService = require('./user.service')

const mockStore = {
  users: {
    findOrCreate: jest.fn(),
    findAll: jest.fn()
  },
  trips: {
    destroy: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
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
      const { findOrCreate } = mockStore.users
      findOrCreate.mockReturnValueOnce([{ id: user.id }])

      const record = await db.findOrCreateUser(user)

      expect(findOrCreate).toHaveBeenCalledWith({
        where: { email: user.email }
      })
      expect(record).toEqual({ id: user.id })
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
    const { destroy } = mockStore.trips
    const launchId = 1
    const userId = user.id

    afterEach(() => destroy.mockReset())

    test('no user returns false', async () => {
      const record = await db.cancelTrip({ launchId })
      expect(record).toBeFalsy()
    })

    test('cancels a trip', async () => {
      db.initialize({ context: { user } }) // Set User
      destroy.mockReturnValue({})

      const record = await db.cancelTrip({ launchId })

      expect(destroy).toHaveBeenCalledTimes(1)
      expect(destroy).toHaveBeenCalledWith({ where: { launchId, userId } })
      expect(record).toBeTruthy()

      db.initialize({ context: null }) // Clear user
    })
  })

  describe('Get Launch Ids By User', () => {
    const { findAll } = mockStore.trips
    const launchId = 1
    const userId = user.id

    beforeEach(() => db.initialize({ context: { user } }))
    afterEach(() => findAll.mockReset())

    test('no user returns false', async () => {
      db.initialize({ context: null }) // Set User
      const record = await db.getLaunchIdsByUser()
      expect(record).toBeFalsy()
    })

    test('retrieves all trips for a user', async () => {
      findAll.mockReturnValueOnce([{ dataValues: { launchId } }])

      const record = await db.getLaunchIdsByUser()

      expect(findAll).toHaveBeenCalledTimes(1)
      expect(findAll).toHaveBeenCalledWith({ where: { userId } })

      expect(record).toHaveLength(1)
      expect(record).toEqual(expect.arrayContaining([launchId]))
    })

    test('no trips returns empty array', async () => {
      const record = await db.getLaunchIdsByUser()
      expect(record).toEqual(expect.arrayContaining([]))
    })
  })

  describe('Is Booked On Launch', () => {
    const { findOne } = mockStore.trips
    const launchId = 1
    const userId = user.id

    beforeEach(() => db.initialize({ context: { user } }))
    afterEach(() => findOne.mockReset())

    test('no user returns false', async () => {
      db.initialize({ context: null }) // Set User
      const record = await db.isBookedOnLaunch({ launchId })
      expect(record).toBeFalsy()
    })

    test('not booked returns false', async () => {
      findOne.mockReturnValue(null)
      const record = await db.isBookedOnLaunch({ launchId })
      expect(record).toBeFalsy()
    })

    test('verifies user is booked on a trip', async () => {
      findOne.mockReturnValue({})
      const record = await db.isBookedOnLaunch({ launchId })

      expect(findOne).toHaveBeenCalledTimes(1)
      expect(findOne).toHaveBeenCalledWith({ where: { launchId, userId } })
      expect(record).toBeTruthy()
    })
  })
})

module.exports.mockStore = mockStore
