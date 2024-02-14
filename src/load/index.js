import loadOptions from './options/index.js'
import loadTransformers from './transformers/index.js'
import loadValidators from './validators/index.js'

export default async ({
  path,
  config }) => {

  const options = await loadOptions({
    path,
    config
  })

  const transformersRaw = await loadTransformers({
    path,
    config
  })

  let transformers = {
    in: [],
    out: [],
    display: []
  }

  if (transformersRaw && transformersRaw.length) {
    const _in = transformersRaw.filter(a => (a.modes && a.modes.includes('in')))
    const out = transformersRaw.filter(a => (a.modes && a.modes.includes('out')))
    const display = transformersRaw.filter(a => (a.modes && a.modes.includes('display')))
    transformers = {
      in: _in,
      out,
      display
    }
  }

  const validators = await loadValidators({
    path: `${path}/validators`,
    config,
    options,
  })

  return {
    options,
    transformers,
    validators
  }
}
