const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')

const prompts = require('./prompts')
const writeFiles = require('./writing')

module.exports = class extends Generator {
  async prompting() {
    this.log(yosay(`Welcome to the kickass ${chalk.red('front-starter-kit')} generator!`))

    const props = await this.prompt(prompts)
    this.props = props

    this.env.options.nodePackageManager = this.props['package-manager'] || 'npm'
  }

  writing() {
    this.log(writeFiles, 'WRITE')
    writeFiles.call(this)
  }

  end() {
    if (this.props.sprites.indexOf('sprite-svg') > -1) {
      this.log(
        `\n${chalk.red("DON'T FORGET")} to install ${chalk.blue('svg4everybody')} or ${chalk.blue(
          'svg-use-it'
        )} otherwise IE will not show you svg sprite, if you relay need to support it. ¯\\_(ツ)_/¯\n`
      )
    }
    this.log(chalk.green('Done!'))
  }
}
