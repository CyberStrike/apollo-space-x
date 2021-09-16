module.exports = {
  isBooked: async (launch, _, { dataSources }) => {
    return dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
  }
}
