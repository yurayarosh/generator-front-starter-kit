module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Input project name.',
    default: 'app',
  },
  {
    type: 'input',
    name: 'author',
    message: 'Input project author.',
  },
  {
    type: 'input',
    name: 'license',
    message: 'Input project license.',
    default: 'MIT',
  },
  {
    type: 'list',
    name: 'package-manager',
    message: 'What package manager would it be?',
    choices: [
      {
        name: 'Yarn',
        value: 'yarn',
      },
      {
        name: 'NPM',
        value: 'npm',
      },
    ],
    default: 0,
  },
  {
    type: 'list',
    name: 'css',
    message: 'Choose CSS engine.',
    choices: [
      {
        name: 'Scss',
        value: 'scss',
      },
      {
        name: 'Sass',
        value: 'sass',
      },
    ],
    default: 0,
  },
  {
    type: 'checkbox',
    name: 'sprites',
    message: 'How will we handle icons?',
    choices: [
      {
        name: 'Lazy loaded inline SVG',
        value: 'inline-svg-lazy',
        checked: true,
      },
      {
        name: 'Inline SVG',
        value: 'inline-svg',
        checked: false,
      },
      {
        name: 'SVG sprites',
        value: 'sprite-svg',
        checked: false,
      },
      {
        name: 'PNG sprites',
        value: 'png',
        checked: false,
      },
    ],
  },
  {
    type: 'confirm',
    name: 'pwa',
    message: 'Make pwa version?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'preview',
    message: 'Make preview page with all htmls?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'multilanguage',
    message: 'Make multilanguage version?',
    default: false,
  },
]
