const { ApolloServer, gql } = require('apollo-server');
const resolvers = require('./resolvers.js')
const typeDefs = require('./typedefs.js') ;


const server = new ApolloServer({ typeDefs, resolvers })
const { url } = server.listen().then
  (({ url }) => console.log(`🚀  Server ready at ${url}`)
)

