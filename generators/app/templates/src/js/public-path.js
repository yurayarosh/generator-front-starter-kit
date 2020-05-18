import { appScript } from './helpers'

if (!appScript) throw new Error('No script element with id `app-script`')
const { src } = appScript
// eslint-disable-next-line
__webpack_public_path__ = src.substr(0, src.lastIndexOf('/') + 1)
