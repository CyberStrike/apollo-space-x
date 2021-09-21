module.exports = async (_, { launchIds }, { dataSources }) => {
  const results = await dataSources.userAPI.bookTrips({ launchIds })
  const launches = await dataSources.launchAPI.getLaunchesByIds({
    launchIds
  })

  return {
    success: results && results.length === launchIds.length,
    message:
      results.length === launchIds.length
        ? 'trips booked successfully'
        : `the following launches couldn't be booked: ${launchIds.filter(
            (id) => !results.includes(id)
          )}`,
    launches
  }
}
