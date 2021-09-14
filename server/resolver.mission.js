module.exports = {
  missionPatch: (mission, { size } = { size: 'LARGE' }) => {
    const options = {
      LARGE: mission.missionPatchLarge,
      SMALL: mission.missionPatchSmall
    }

    return options[size]
  }
}

// This is faster than the first one 🤔
// module.exports = {
//   missionPatch: (mission, size) => {
//     const patchSize = size ? size.size : 'LARGE'

//     const options = {
//       LARGE: mission.missionPatchLarge,
//       SMALL: mission.missionPatchSmall
//     }

//     return options[patchSize]
//   }
// }
