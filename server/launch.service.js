const { RESTDataSource } = require('apollo-datasource-rest')

const baseURL = 'https://api.spacexdata.com/v2/'

class LaunchAPI extends RESTDataSource {
  constructor () {
    super()
    this.baseURL = baseURL
  }

  launchReducer (launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type
      }
    }
  }

  async getAllLaunches () {
    const response = await this.get('launches')
    return Array.isArray(response)
      ? response.map((launch) => this.launchReducer(launch))
      : []
  }

  async getLaunchById ({ launchId }) {
    const endpoint = 'launches'
    const response = await this.get(endpoint, { flight_number: launchId })
    return Array.isArray(response) ? this.launchReducer(response[0]) : []
  }

  getLaunchesByIds ({ launchIds }) {
    return Promise.all(
      launchIds.map((launchId) => this.getLaunchById({ launchId }))
    )
  }
}

module.exports = LaunchAPI
