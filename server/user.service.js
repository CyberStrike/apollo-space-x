const { DataSource } = require('apollo-datasource')
const isEmail = require('isemail')

class UserAPI extends DataSource {
  constructor ({ store }) {
    super()
    this.store = store
  }

  initialize (config) {
    this.context = config.context
  }

  async findOrCreateUser ({ email: emailArg } = {}) {
    const email = this.context?.user?.email ?? emailArg

    const notEmail = !email || !isEmail.validate(email)
    if (notEmail) return null

    const users = await this.store.users.findOrCreate({ where: { email } })
    const hasUsers = users && users[0]
    return hasUsers ? users[0] : null
  }
}

module.exports = UserAPI
