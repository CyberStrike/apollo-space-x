require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const { createStore } = require('./utilities')

const typeDefs = require('./schema.js')
const resolvers = require('./resolvers.js')

const LaunchAPI = require('./launch.service')
const UserAPI = require('./user.service')
const UserTrip = require('./userTrip.service')
const IsEmail = require('isemail')

const store = createStore()

const server = new ApolloServer({
  context: async ({ req }) => {
    // auth check on every request
    const auth = req?.headers?.authorization || ''
    const email = Buffer.from(auth, 'base64').toString('ascii')
    if (!IsEmail.validate(email)) return { user: null }

    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } })
    const user = (users && users[0]) || null
    return { user: { ...user.dataValues } }
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
    userTrip: new UserTrip({ store })
  })
})

server.listen().then(({ url }) =>
  console.log(`
  🚀  Server ready at ${url}
  🔭  Explore at https://studio.apollographql.com/sandbox
`)
)
