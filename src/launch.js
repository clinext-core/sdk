import * as dotenv from 'dotenv'
import _yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import fs from 'fs'
import registerCommands from './commands/index.js'
import _path from 'path'
import { fileURLToPath } from "url"
import { dirname } from "path"
import getFileCallerURL from './lib/getFileCallerURL.js'
import loadValidators from './load/validators/index.js'
import loadArtefacts from './load/index.js'
import buildToolbox from './toolbox/index.js'
import loadEnv from './load/env.js'
import loadExtensions from './load/extensions/index.js'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async ({ path, npmPackage, config } = {}) => {

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
    const __d = _path.resolve(__actualPath, '../cli.config.json')
    if (fs.existsSync(__d)) {
      __actualConfig = JSON.parse(fs.readFileSync(__d).toString())
    }
  }
  if (!__actualConfig) {
    __actualConfig = {}
  }
  //https://github.com/yargs/yargs/issues/569



  const yargs = _yargs(hideBin(process.argv))


  yargs
    // .options(options)
    .usage('Usage: servable <command>')
    .demandCommand(1)
    .wrap(Math.min(yargs.terminalWidth(), 160))
    .help('help')
    .alias('help', 'h')
    .version(__actualNpmPackage.version)
    .alias('version', 'v')
    .hide('help')
    .hide('version')
    .epilog('Made by Servable.')

  let { options, transformers, validators } = await loadArtefacts({
    path: __actualPath,
    config: __actualConfig
  })

  validators = {
    ...validators,
    ...(await loadValidators({
      path: _path.resolve(__dirname, "./validators"),
      config: __actualConfig,
      options,
    }))
  }

  const payload = {}
  const toolbox = buildToolbox({
    payload,
    options,
    yargs,
    transformers,
    validators
  })


  await loadEnv({
    projectSrcPath: __actualPath,
    toolbox
  })

  const extensions = await loadExtensions({
    path: `${__actualPath}/extensions`,
    toolbox,
    config: __actualConfig
  })

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

  global.CliNext = toolbox

  await registerCommands({
    path: __actualPath,
    yargs,
    config: __actualConfig,
    options,
    toolbox,
    payload
  })

}
