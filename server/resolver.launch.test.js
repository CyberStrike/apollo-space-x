const resolvers = require('./resolvers')
const { isBooked } = resolvers.Launch

const dataSources = {
  userAPI: {
    isBookedOnLaunch: jest.fn()
  }
}

const launch = { id: 1337 }

describe('[Launch.isBooked]', () => {
  it('is called with expected arguments', async () => {
    const { isBookedOnLaunch } = dataSources.userAPI
    isBookedOnLaunch.mockResolvedValue({ id: 1337 })

    const userIsBooked = await isBooked(launch, null, { dataSources })

    expect(isBookedOnLaunch).toHaveBeenCalledWith({ launchId: launch.id })
    expect(userIsBooked).toBeTruthy()
  })
})
