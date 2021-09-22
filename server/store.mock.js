module.exports = {
  users: {
    findOrCreate: jest.fn(),
    findAll: jest.fn()
  },
  trips: {
    destroy: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOrCreate: jest.fn()
  }
}
