const { paginateResults } = require('./utilities')

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
  Mission: {
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      const options = {
        LARGE: mission.missionPatchLarge,
        SMALL: mission.missionPatchSmall
      }

      return options[size]
    }
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) => {
      return dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
    }
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = dataSources.userAPI.getLaunchIdsByUser()
      if (!launchIds) return []
      return dataSources.launchAPI.getLaunchesById({ launchIds }) || []
    }
  },
  Mutation: {
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds })
      const launches = await dataSources.launchAPI.getLaunchesById({
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
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId })
      if (!result) {
        return {
          success: false,
          message: 'failed to cancel trip'
        }
      }

      const launch = await dataSources.launchAPI.getLaunchById({ launchId })
      return { success: true, message: 'trip canceled', launches: [launch] }
    },
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email })
      const setAndEncodeEmail = (user) => {
        user.token = Buffer.from(email).toString('base64')
        return user
      }

      if (user) return setAndEncodeEmail(user)
    }
  }
}

module.exports = resolvers
