const resolvers = require('./resolvers')

const mockContext = {
  dataSources: {
    userAPI: {
      findOrCreateUser: jest.fn()
    }
  },
  user: { id: 1, email: 'a@a.a' }
}

describe('[Mutation.login]', () => {
  const { findOrCreateUser } = mockContext.dataSources.userAPI

  it('returns base64 encoded email if successful', async () => {
    const args = { email: 'a@a.a' }
    findOrCreateUser.mockReturnValueOnce(args)
    const base64Email = Buffer.from(args.email).toString('base64')

    const { token } = await resolvers.Mutation.login(null, args, mockContext)
    expect(findOrCreateUser).toHaveBeenCalledWith(args)
    expect(token).toEqual(base64Email)
  })

  it('returns nothing if login fails', async () => {
    const args = { email: 'a@a.a' }
    // simulate failed lookup/creation
    findOrCreateUser.mockReturnValueOnce(false)

    // check the resolver response
    const res = await resolvers.Mutation.login(null, args, mockContext)
    expect(res).toBeFalsy()
  })
})
