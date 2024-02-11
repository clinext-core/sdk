import jetpack from 'fs-jetpack'
import loadArtefacts from '../index.js'

export default async ({ path, toolbox, config }) => {
  const candidates = await jetpack.listAsync(path)
  if (!candidates || !candidates.length) {
    return
  }

  return Promise.all(candidates.map(async item => {
    const candidatePath = `${path}/${item}`
    const indexPath = `${candidatePath}/index.js`

    const index = (await import(indexPath)).default
    const { id, description, register } = index
    if (!id || !register) {
      return
    }

    let { options, transformers, validators } = await loadArtefacts({
      path: candidatePath,
      config
    })

    await register({ toolbox })

    return {
      id,
      index,
      register,
      questions: [
        ...((options && options.length) ? options : []),
        ...((index.questions && index.questions.length) ? index.questions : []),
      ],
      transformers: {
        ...((transformers && transformers.length) ? transformers : []),
        ...((index.transformers && index.transformers.length) ? index.transformers : []),
      },
      validators: {
        ...((validators && validators.length) ? validators : []),
        ...((index.validators && index.validators.length) ? index.validators : []),
      }
    }
  }))
}
