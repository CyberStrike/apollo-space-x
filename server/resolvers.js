const { paginateResults } = require('./utilities')
const login = require('./mutation.login')
const cancelTrip = require('./mutation.canceltrip')
const bookTrips = require('./mutation.bookTrips')
const User = require('./resolver.user')

const resolvers = {
  Query: {
    rockets: () => [
      {
        title: 'The Awakening',
        author: 'Kate Chopin'
      },
      {
        title: 'City of Glass',
        author: 'Paul Auster'
      }
    ],
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      // I'm not sure why the writers of this tutorial are paginating after fetching all
      // all the results good for a demo bad for production.
      const allLaunches = await dataSources.launchAPI.getAllLaunches()

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      })

      const hasLaunches = launches.length

      const lastLaunch = launches[launches.length - 1]

      const lastLaunchCursor = hasLaunches ? lastLaunch.cursor : null

      const allLaunchesCursor = allLaunches[allLaunches.length - 1].cursor

      const hasMore = hasLaunches
        ? lastLaunchCursor !== allLaunchesCursor
        : false

      return { data: launches, cursor: lastLaunchCursor, hasMore }
    },
    launch: (_, { id }, { dataSources }) => {
      return dataSources.launchAPI.getLaunchById({ launchId: id })
    }
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) => {
      return dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
    }
  },
  Mission: {
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      const options = {
        LARGE: mission.missionPatchLarge,
        SMALL: mission.missionPatchSmall
      }

      return options[size]
    }
  },
  Mutation: { bookTrips, cancelTrip, login },
  User
}

module.exports = resolvers
