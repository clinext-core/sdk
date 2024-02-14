import checkFileExists from '../../../lib/checkFileExists.js'
import loadExtension from '../extension.js'

export default async ({ modulesPath, config }) => {
  const { extensions } = config
  if (!extensions || !extensions.length) {
    return null
  }

  return Promise.all(extensions.map(async extension => {
    let id = null
    const _type = typeof extension
    let params = {}
    let path = null

    switch (_type) {
      case 'string': {
        // path = await absoluteModuleSrcPath(extension)
        id = extension
      } break
      case 'object': {
        id = extension.id
        params = extension.params
      } break
      default: {
        break
      }
    }

    if (!id) {
      return null
    }

    path = `${modulesPath}/${id}/src`
    if (!path || !(await checkFileExists(path))) {
      return null
    }

    return loadExtension({
      path,
      config,
      params
    })

  }))
}
