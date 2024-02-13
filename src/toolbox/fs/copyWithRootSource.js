import jetpack from 'fs-jetpack'
import fs from 'fs'
import fg from 'fast-glob'
import _isGlob from 'is-glob'
import ensureDirectoryExists from '../../lib/ensureDirectoryExists.js'

export default async ({
  source,
  destination,
  data,
  globOptions = { mark: true },
  render = true,
  rootSource
}) => {

  const isGlob = _isGlob(source)
  const entries = await fg([source], globOptions,)

  for (var _i in entries) {
    const entry = entries[_i]
    let _destination = isGlob
      ? entry.replace(rootSource, destination)
      : destination

    _destination = _destination.replace("{.}", ".")
    await ensureDirectoryExists(_destination)

    if (!data || !render) {
      await doCopyFile({ entry, _destination })
      continue
    }

    try {
      const content = await fs.promises.readFile(entry, 'utf8')
      const result = await CliNext.template.render({ template: content, data })
      await fs.promises.writeFile(_destination, result)
    } catch (e) {
      console.info(`Could not write file ${entry}`, e)
      await doCopyFile({ entry, _destination })
      continue
    }
  }
}

const doCopyFile = async ({ entry, _destination }) => {
  try {
    return jetpack.copyAsync(entry, _destination, { overwrite: true })
  } catch (e) {
    console.error(e)
  }
}
