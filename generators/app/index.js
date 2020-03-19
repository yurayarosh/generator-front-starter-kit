const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')

const prompts = require('./prompts')
const writeFiles = require('./writing')

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(`Welcome to the kickass ${chalk.red('front-starter-kit')} generator!`))

    return this.prompt(prompts).then(props => {
      this.props = props
    })
  }

  writing() {
    console.log(writeFiles, 'WRITE')
    writeFiles.call(this)
  }

  install() {
    if (this.props.install) {
      this.installDependencies({
        bower: false,
        npm: false,
        yarn: true,
      })
    } else {
      this.log(`Run ${chalk.blue('npm install')} or ${chalk.blue('yarn')} to install dependencies later.`)
    }
  }

  end() {
    if (this.props.sprites.indexOf('sprite-svg') > -1) {
      this.log(
        '\n'
        + chalk.red('DON\'T FORGET')
        + ' to install '
        + chalk.blue('svg4everybody')
        + ' or ' + chalk.blue('svg-use-it')
        + ' otherwise IE will not show you svg sprite ¯\\_(ツ)_/¯'
        + '\n'
      );
    }
    this.log(chalk.green('Done!'))
  }
}
