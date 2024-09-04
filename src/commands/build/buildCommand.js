
export default async ({
  path,
  toolbox,
}) => {
  const data = (await import(path)).default
  const {
    name = '',
    description = '',
  } = data

  const command = {
    command: name,
    desc: description,
    builder: {},
    handler: async (argv,) => {
      if (!data.skipTitleDisplay) {
        toolbox.ui.drawSectionHeader({
          type: 'h1',
          title: description ? description : name,
        })
      }
      if (data.handler) {
        const result = await data.handler({ toolbox })
        // console.log(result)
        process.exit(1)
      }
    }
  }

  return {
    command,
    data: {
      ...data,
      options: (data.options && data.options.length) ? data.options : []
    }
  }
}
