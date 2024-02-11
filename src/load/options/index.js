import checkFileExists from '../../lib/checkFileExists.js'
import directoryFilesRecursive from '../../lib/directoryFilesRecursive.js'

export default async ({ path, config, }) => {
  const optionsPath = `${path}/questions`
  if (!(await checkFileExists(optionsPath))) {
    return null
  }
  let files = await directoryFilesRecursive({
    path: optionsPath,
    includeMeta: false
  })
  files = files ? files.map(f => f.default) : []
  return files
}
