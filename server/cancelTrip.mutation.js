module.exports = async (_, { launchId }, { dataSources }) => {
  const result = await dataSources.userAPI.cancelTrip({ launchId })
  if (!result) {
    return {
      success: false,
      message: 'failed to cancel trip'
    }
  }

  const launch = await dataSources.launchAPI.getLaunchById({ launchId })
  return { success: true, message: 'trip cancelled', launches: [launch] }
}
