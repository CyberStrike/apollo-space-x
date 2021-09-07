const resolvers = require('./resolvers')

const mockContext = {
  dataSources: {
    userAPI: {
      bookTrips: jest.fn()
    },
    launchAPI: {
      getLaunchesByIds: jest.fn()
    }
  }
}

describe('[Mutation.BookTrip]', () => {
  describe('Success', () => {
    it('returns expected data', async () => {
      const args = { launchIds: [1337] }

      const { bookTrips } = mockContext.dataSources.userAPI
      const { getLaunchesByIds } = mockContext.dataSources.launchAPI

      bookTrips.mockReturnValueOnce(args.launchIds)
      getLaunchesByIds.mockReturnValueOnce(args.launchIds)

      const { message, success, launches } = await resolvers.Mutation.bookTrips(
        null,
        args,
        mockContext
      )

      expect(bookTrips).toHaveBeenCalledWith(args)
      expect(message).toBe('trips booked successfully')
      expect(success).toBeTruthy()
      expect(launches).toContain(1337)
    })
  })

  describe('Fails', () => {
    it('returns error message', async () => {
      const args = { launchIds: [1337] }
      const errorMessage = `the following launches couldn't be booked: ${args.launchIds}`

      const { bookTrips } = mockContext.dataSources.userAPI

      bookTrips.mockReturnValueOnce([])

      const { message, success } = await resolvers.Mutation.bookTrips(
        null,
        args,
        mockContext
      )

      expect(bookTrips).toHaveBeenCalledWith(args)
      expect(message).toBe(errorMessage)
      expect(success).toBeFalsy()
    })
  })
})
