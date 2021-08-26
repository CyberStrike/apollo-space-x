const { ApolloServer } = require('apollo-server')
const { createStore } = require('./utilities')

const typeDefs = require('./schema.js')
const resolvers = require('./resolvers.js')

const LaunchAPI = require('./services/launch')
const UserAPI = require('./services/user')

const store = createStore()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  })
})

server.listen().then(({ url }) =>
  console.log(`
  🚀  Server ready at ${url}
  🔭  Explore at https://studio.apollographql.com/sandbox
`)
)
