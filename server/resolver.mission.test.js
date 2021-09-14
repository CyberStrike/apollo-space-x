const resolvers = require('./resolvers')
const { missionPatch } = resolvers.Mission

const mockMission = {
  missionPatchLarge: 'LARGE',
  missionPatchSmall: 'SMALL'
}

describe('[Mission.missionPatch]', () => {
  it('returns default patch size of large', () => {
    const patchSize = missionPatch(mockMission)
    expect(patchSize).toBe('LARGE')
  })

  it('returns large patch size', () => {
    const size = 'LARGE'
    const patchSize = missionPatch(mockMission, { size })
    expect(patchSize).toBe(size)
  })

  it('returns small patch size', () => {
    const size = 'SMALL'
    const patchSize = missionPatch(mockMission, { size })
    expect(patchSize).toBe(size)
  })
})
