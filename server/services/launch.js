const { RESTDataSource } = require('apollo-datasource-rest')

const baseURL = 'https://api.spacexdata.com/v2/'

class LaunchAPI extends RESTDataSource {
  constructor () {
    super()
    this.baseURL = baseURL
  }
}

module.exports = LaunchAPI
