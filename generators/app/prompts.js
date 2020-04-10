module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Input project name',
    default: 'app',
  },
  {
    type: 'input',
    name: 'author',
    message: 'Input project author'
  },
  {
    type: 'input',
    name: 'license',
    message: 'Input project license',
    default: 'MIT',
  },
  {
    type: 'list',
    name: 'css',
    message: 'Choose CSS engine',
    choices: [
      {
        name: 'Sass + PostCSS',
        value: 'sass',
      },
      {
        name: 'Scss + PostCSS',
        value: 'scss',
      },
    ],
    default: 0,
  },
  {
    type: 'confirm',
    name: 'cssGrid',
    message: 'Add css grid to libs?',
    default: false,
  },
  {
    type: 'checkbox',
    name: 'sprites',
    message: 'How will we handle icons?',
    choices: [
      {
        name: 'Inline SVG',
        value: 'inline-svg',
        checked: true,
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
  {
    type: 'confirm',
    name: 'install',
    message: 'Install dependencies right now?',
    default: true,
  },
]
