import del from 'del'
import colors from 'ansi-colors'
import log from 'fancy-log'
import { dest } from '../config'

const build = () => async () => {
  const paths = await del([dest.root])
  return log('Deleted:\n', colors.magenta(paths.join('\n')))
}

module.exports.build = build
