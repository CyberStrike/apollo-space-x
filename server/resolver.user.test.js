const resolvers = require('./resolvers')

describe('[User.trips]', () => {
  const mockContext = {
    dataSources: {
      userAPI: { getLaunchIdsByUser: jest.fn() },
      launchAPI: { getLaunchesById: jest.fn() }
    },
    user: { id: 1 }
  }
  const { getLaunchIdsByUser } = mockContext.dataSources.userAPI
  const { getLaunchesById } = mockContext.dataSources.launchAPI

  it('uses user id from context to lookup trips', async () => {
    getLaunchIdsByUser.mockReturnValueOnce([999])
    getLaunchesById.mockReturnValueOnce([{ id: 999 }])

    // check the resolver response
    const res = await resolvers.User.trips(null, null, mockContext)
    expect(res).toEqual([{ id: 999 }])

    // make sure the dataSources were called properly
    expect(getLaunchesById).toHaveBeenCalledWith({ launchIds: [999] })
    expect(getLaunchIdsByUser).toHaveBeenCalled()
  })

  it('returns empty array if no response', async () => {
    getLaunchIdsByUser.mockReturnValueOnce([])
    getLaunchesById.mockReturnValueOnce([])

    const res = await resolvers.User.trips(null, null, mockContext)
    expect(res).toEqual([])
  })
})
