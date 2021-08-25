const Books = [
  { title: 'The Awakening', author: 'Kate Chopin' },
  { title: 'City Of Glass', author: 'Paul Aster' }
]

const resolvers = {
  Query: {
    books: () => Books
  }
}

module.export = resolvers
