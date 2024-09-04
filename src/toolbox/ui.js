import chalk from "chalk"

export default ({ toolbox }) => {
  return {
    drawSectionHeader: ({ title, subTitle, type = 'text', accent = 'main' }) => {
      switch (type) {
        case 'h1': {
          toolbox.print.log(`\n`)
          if (accent === 'error') {
            toolbox.print.log(chalk.red.bold(`${title}`))
          } else {
            toolbox.print.log(chalk.magenta.bold(`${title}`))
          }

          if (subTitle) {
            toolbox.print.log(chalk.gray.italic(`${subTitle}\n`))
          }

          toolbox.print.log(``)
        } break
        case 'h2': {
          toolbox.print.log(`\n`)
          toolbox.print.log(chalk.white.bgGreen.bold(`${title}`))
          if (subTitle) {
            toolbox.print.log(chalk.italic(`${subTitle}\n`))
          }
        } break
        default: {
          toolbox.print.log(chalk.bold(`\n${title}`))
          if (subTitle) {
            toolbox.print.log(chalk.italic(`${subTitle}\n`))
          }
        } break
      }


    },
  }
}

