const UserService = require('./user.service')
const mockStore = require('./store.mock')

const user = { id: 1, email: 'user@example.com' }

const db = new UserService({ store: mockStore })

describe('[User Service]', () => {
  describe('FindOrCreateUser', () => {
    it('invalid email returns null', async () => {
      const email = 'fake'
      const record = await db.findOrCreateUser({ email })
      expect(record).toBeNull()
    })

    it('no user found/created returns null ', async () => {
      const email = 'user@example.com'
      const record = await db.findOrCreateUser({ email })
      expect(record).toBeNull()
    })

    it('looks up / creates user in store', async () => {
      const { findOrCreate } = mockStore.users
      findOrCreate.mockReturnValueOnce([{ id: user.id }])

      const record = await db.findOrCreateUser(user)

      expect(findOrCreate).toHaveBeenCalledWith({
        where: { email: user.email }
      })
      expect(record).toEqual({ id: user.id })
    })
  })
})
