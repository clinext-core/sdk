import formatOptionForYargs from './formatOptionForYargs.js'
import parseArgv from 'tiny-parse-argv'

export default async ({ toolbox, commandOptions, yargs }) => {
  let nativeArgv = parseArgv(process.argv)
  delete nativeArgv["--"]
  delete nativeArgv["_"]
  Object.keys(nativeArgv).forEach(n => {
    toolbox.payload[n] = nativeArgv[n]
  })

  const _options = (commandOptions && commandOptions.length)
    ? commandOptions
    : []
  const options = _options.map(option => {
    const value = nativeArgv[option.name]
    return {
      ...option,
      value
    }
  })
  await toolbox.mergeOptions(options)
  toolbox.options.forEach(option => formatOptionForYargs({ option, yargs }))
  toolbox.questions.forEach(option => formatOptionForYargs({ option, yargs }))
}
