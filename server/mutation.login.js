module.exports = async (_, { email }, { dataSources }) => {
  const user = await dataSources.userAPI.findOrCreateUser({ email })
  const setAndEncodeEmail = (user) => {
    const token = Buffer.from(email).toString('base64')
    return { ...user, token }
  }

  if (user) return setAndEncodeEmail(user)
}
