import del from 'del'
import colors from 'ansi-colors'
import log from 'fancy-log'
import { dest } from '../config'

const build = () => () => {
  return del([dest.root]).then(paths => log('Deleted:', colors.magenta(paths.join('\n'))))
}

module.exports.build = build
