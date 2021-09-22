const { DataSource } = require('apollo-datasource')

class UserTrip extends DataSource {
  constructor ({ store }) {
    super()
    this.store = store
  }

  initialize (config) {
    this.context = config.context
  }

  async bookTrips ({ launchIds }) {
    const userId = this.context?.user?.id
    if (!userId) return

    const results = []

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId })
      if (res) results.push(res)
    }

    return results
  }

  async bookTrip ({ launchId }) {
    const userId = this.context?.user?.id
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId }
    })
    return res && res.length ? res[0].get() : false
  }

  async cancelTrip ({ launchId }) {
    const userId = this.context?.user?.id
    if (!userId) return false

    return !!this.store.trips.destroy({ where: { userId, launchId } })
  }

  async getLaunchIdsByUser () {
    if (!this.context || !this.context.user) return false

    const userId = this.context.user.id
    const records = await this.store.trips.findAll({
      where: { userId }
    })
    return records && records.length
      ? records.map((l) => l.dataValues.launchId).filter((l) => !!l)
      : []
  }

  async isBookedOnLaunch ({ launchId }) {
    if (!this.context || !this.context.user) return false

    const userId = this.context.user.id
    const trip = await this.store.trips.findOne({
      where: { userId, launchId }
    })

    return !!trip
  }
}

module.exports = UserTrip
