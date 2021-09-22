const UserTrip = require('./userTrip.service')
const mockStore = require('./store.mock')

const user = { id: 1, email: 'user@example.com' }
const launchId = 1
const userId = user.id

const userTrip = new UserTrip({ store: mockStore })

describe('[User Trip Service]', () => {
  beforeEach(() => userTrip.initialize({ context: { user } }))

  describe('Book Trip', () => {
    const { findOrCreate } = mockStore.trips

    afterEach(() => findOrCreate.mockReset())

    test('no user returns null', async () => {
      userTrip.initialize({ context: null })
      const record = await userTrip.bookTrip({ launchId })
      expect(record).toBeFalsy()
    })

    test('book a trip', async () => {
      findOrCreate.mockReturnValueOnce([{ get: () => 'result' }])
      const record = await userTrip.bookTrip({ launchId })

      expect(findOrCreate).toHaveBeenCalledTimes(1)
      expect(findOrCreate).toHaveBeenCalledWith({ where: { launchId, userId } })
      expect(record).toBeTruthy()
    })
  })

  describe('Book Trips', () => {
    const { findOrCreate } = mockStore.trips
    const launchIds = [1, 3]

    afterEach(() => findOrCreate.mockReset())

    test('no user returns false', async () => {
      userTrip.initialize({ context: null })
      const record = await userTrip.bookTrips({ launchIds })
      expect(record).toBeFalsy()
    })

    test('books multiple trips', async () => {
      findOrCreate.mockReturnValue([{ get: () => 'record' }])
      const record = await userTrip.bookTrips({ launchIds })

      expect(findOrCreate).toHaveBeenCalledTimes(2)
      expect(findOrCreate).toHaveBeenCalledWith({
        where: { launchId: launchIds[0], userId }
      })
      expect(record).toEqual(expect.arrayContaining(['record']))
    })
  })

  describe('Cancel Trip', () => {
    const { destroy } = mockStore.trips

    afterEach(() => destroy.mockReset())

    test('no user returns false', async () => {
      const record = await userTrip.cancelTrip({ launchId })
      expect(record).toBeFalsy()
    })

    test('cancels a trip', async () => {
      destroy.mockReturnValue({})
      const record = await userTrip.cancelTrip({ launchId })

      expect(destroy).toHaveBeenCalledTimes(1)
      expect(destroy).toHaveBeenCalledWith({ where: { launchId, userId } })
      expect(record).toBeTruthy()
    })
  })

  describe('Get Launch Ids By User', () => {
    const { findAll } = mockStore.trips

    afterEach(() => findAll.mockReset())

    test('no user returns false', async () => {
      userTrip.initialize({ context: null }) // Set User
      const record = await userTrip.getLaunchIdsByUser()

      expect(record).toBeFalsy()
    })

    test('retrieves all trips for a user', async () => {
      findAll.mockReturnValueOnce([{ dataValues: { launchId } }])

      const record = await userTrip.getLaunchIdsByUser()

      expect(findAll).toHaveBeenCalledTimes(1)
      expect(findAll).toHaveBeenCalledWith({ where: { userId } })

      expect(record).toHaveLength(1)
      expect(record).toEqual(expect.arrayContaining([launchId]))
    })

    test('no trips returns empty array', async () => {
      const record = await userTrip.getLaunchIdsByUser()
      expect(record).toEqual(expect.arrayContaining([]))
    })
  })

  describe('Is Booked On Launch', () => {
    const { findOne } = mockStore.trips

    afterEach(() => findOne.mockReset())

    test('no user returns false', async () => {
      userTrip.initialize({ context: null }) // Set User
      const record = await userTrip.isBookedOnLaunch({ launchId })

      expect(record).toBeFalsy()
    })

    test('not booked returns false', async () => {
      findOne.mockReturnValue(null)
      const record = await userTrip.isBookedOnLaunch({ launchId })

      expect(record).toBeFalsy()
    })

    test('verifies user is booked on a trip', async () => {
      findOne.mockReturnValue({})
      const record = await userTrip.isBookedOnLaunch({ launchId })

      expect(findOne).toHaveBeenCalledTimes(1)
      expect(findOne).toHaveBeenCalledWith({ where: { launchId, userId } })
      expect(record).toBeTruthy()
    })
  })
})
