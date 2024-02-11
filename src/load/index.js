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

  const transformers = {
    in: await loadTransformers({
      path: `${path}/transformers/in`,
    }),
    out: await loadTransformers({
      path: `${path}/transformers/out`,
    }),
    display: await loadTransformers({
      path: `${path}/transformers/display`,
    }),
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
