import getModuleDir from './getModuleDir.js'

export default (item) => {
  const path = getModuleDir(item)
  if (!path) {
    return null
  }

  return `${path}/src`
}
