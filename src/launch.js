import * as dotenv from 'dotenv'
import _yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import fs from 'fs'
import registerCommands from './commands/index.js'
import _path from 'path'
import getFileCallerURL from './lib/getFileCallerURL.js'
import loadArtefacts from './load/index.js'
import buildToolbox from './toolbox/index.js'
import loadEnv from './load/env.js'
import loadInlineExtensions from './load/extensions/loadInlines/index.js'
import loadModuleExtensions from './load/extensions/loadModules/index.js'

dotenv.config()

export default async ({
  path,
  npmPackage,
  config } = {}) => {

  // import options from './options.js';
  let __actualPath = path
  if (!__actualPath) {
    const ce = getFileCallerURL()
    __actualPath = _path.dirname(ce)
    __actualPath = __actualPath.replace('file://', '')
  }

  let __actualNpmPackage = npmPackage
  if (!__actualNpmPackage) {
    const __d = _path.resolve(__actualPath, '../package.json')
    if (fs.existsSync(__d)) {
      __actualNpmPackage = JSON.parse(fs.readFileSync(__d).toString())
    }
  }
  if (!__actualNpmPackage) {
    __actualNpmPackage = { version: "0.0.0" }
  }

  let __actualConfig = config
  if (!__actualConfig) {
    const __d = _path.resolve(__actualPath, '../clinext.config.js')
    if (fs.existsSync(__d)) {
      __actualConfig = (await import(__d)).default
    }
  }

  if (!__actualConfig) {
    __actualConfig = {}
  }
  //https://github.com/yargs/yargs/issues/569



  const yargs = _yargs(hideBin(process.argv))

  yargs
    // .options(options)
    .usage(`Usage: ${__actualConfig.usage ? __actualConfig.usage : ""}`)
    .demandCommand(1)
    .wrap(Math.min(yargs.terminalWidth(), 160))
    .help('help')
    .alias('help', 'h')
    .version(__actualNpmPackage.version)
    .alias('version', 'v')
    .hide('help')
    .hide('version')
    .epilog(__actualConfig.epilog ? __actualConfig.epilog : "")


  const _env = await loadEnv({
    projectSrcPath: __actualPath,
  })


  let { options, transformers, validators } = await loadArtefacts({
    path: __actualPath,
    config: __actualConfig
  })

  let extensions = await loadInlineExtensions({
    path: `${__actualPath}/extensions`,
    config: __actualConfig
  })

  let _extensions = await loadModuleExtensions({
    config: __actualConfig,
    modulesPath: `${_path.resolve(__actualPath, '../')}/node_modules`
  })


  extensions = extensions.concat(_extensions)


  if (extensions && extensions.length) {
    for (var i in extensions) {
      const extension = extensions[i]
      options = [
        ...((options && options.length) ? options : []),
        ...((extension.questions && extension.questions.length) ? extension.questions : []),
      ]
      transformers = {
        ...((transformers && transformers.length) ? transformers : []),
        ...((extension.transformers && extension.transformers.length) ? extension.transformers : []),
      }
      validators = {
        ...((validators && validators.length) ? validators : []),
        ...((extension.validators && extension.validators.length) ? extension.validators : []),
      }
    }
  }

  const payload = {}
  const toolbox = buildToolbox({
    payload,
    options,
    yargs,
    transformers,
    validators
  })
  toolbox.env = _env

  await registerCommands({
    path: __actualPath,
    yargs,
    config: __actualConfig,
    toolbox,
    payload
  })

  global.CliNext = toolbox

  if (extensions && extensions.length) {
    await Promise.all(extensions.map(extension => {
      extension.register({ toolbox })
    }))
  }
}
