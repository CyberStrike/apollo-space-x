module.exports = {
  trips: async (_, __, { dataSources }) => {
    const launchIds = dataSources.userAPI.getLaunchIdsByUser()
    if (!launchIds) return []
    return dataSources.launchAPI.getLaunchesById({ launchIds }) || []
  }
}
