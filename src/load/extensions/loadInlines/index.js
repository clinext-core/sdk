import jetpack from 'fs-jetpack'
import extension from '../extension.js'

export default async ({ path, config }) => {
  const candidates = await jetpack.listAsync(path)
  if (!candidates || !candidates.length) {
    return
  }

  return Promise.all(candidates.map(async candidate => {
    return extension({ path: `${path}/${candidate}`, config })
  }))
}
