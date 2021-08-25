const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema.js')
const resolvers = require('./resolvers.js')

const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) =>
  console.log(`
  🚀  Server ready at ${url}
  🔭  Explore at https://studio.apollographql.com/sandbox
`)
)
