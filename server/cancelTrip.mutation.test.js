const resolvers = require('./resolvers')

const mockContext = {
  dataSources: {
    userAPI: {
      cancelTrip: jest.fn()
    },
    launchAPI: {
      getLaunchById: jest.fn()
    }
  }
}

describe('[Mutation.CancelTrip]', () => {
  const { cancelTrip } = mockContext.dataSources.userAPI
  const { getLaunchById } = mockContext.dataSources.launchAPI

  describe('Success', () => {
    it('returns message', async () => {
      const args = { launchId: 1337 }

      cancelTrip.mockReturnValue(true)
      getLaunchById.mockReturnValueOnce({ id: args.launchId })

      const { success, message, launches } =
        await resolvers.Mutation.cancelTrip(null, args, mockContext)

      expect(cancelTrip).toHaveBeenCalledWith(args)
      expect(message).toBe('trip cancelled')
      expect(success).toBeTruthy()
      expect(launches).toEqual([{ id: args.launchId }])
    })
  })

  describe('Fails', () => {
    it('returns false', async () => {
      const args = { launchId: 1337 }

      cancelTrip.mockReturnValue(false)

      const { success, message } = await resolvers.Mutation.cancelTrip(
        null,
        args,
        mockContext
      )

      expect(cancelTrip).toHaveBeenCalledWith(args)
      expect(message).toBe('failed to cancel trip')
      expect(success).toBeFalsy()
    })
  })
})
