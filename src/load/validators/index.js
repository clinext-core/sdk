import checkFileExists from '../../lib/checkFileExists.js'
import directoryFilesRecursive from '../../lib/directoryFilesRecursive.js'

export default async ({ path, }) => {
  if (!(await checkFileExists(path))) {
    return null
  }
  let files = await directoryFilesRecursive({
    path,
    includeMeta: false
  })
  files = files ? files.map(f => f.default) : []
  const result = {}
  files.forEach(file => {
    if (!file.id) {
      return
    }
    result[file.id.toLowerCase()] = file
  })
  return result
}
