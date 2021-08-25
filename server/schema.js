const { gql } = require('apollo-server')

const typeDefs = gql`
  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Mission {
    name: String
    missionPatchSize(size: PatchSize): String
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]
  }

  enum PatchSize {
    SMALL
    LARGE
  }

  type Query {
    launch(id: ID): Launch
    launches: [Launch]!
    rockets: [Rocket]
    me: User
  }

  type TripUpdateResponse {
    success: Boolean
    message: String
    launches: [Launch]
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(LaunchId: ID!): TripUpdateResponse!
    login(email: String): User
  }
`

module.exports = typeDefs