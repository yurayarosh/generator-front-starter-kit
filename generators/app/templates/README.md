## How to use

Clone this repo and then in command line type:

* `npm install` or `yarn` - install all dependencies
* `gulp` - run dev-server and let magic happen, or
* `gulp build` - build project from sources


## List of Gulp tasks

To run separate task type in command line `gulp [task_name]`.
Almost all tasks also have watch mode - `gulp [task_name]:watch`, but you don't need to use it directly.

### Main tasks
Task name          | Description                                                      
:------------------|:----------------------------------
`default`          | will start all tasks required by project in dev mode: initial build, watch files, run server with livereload
`build:dev`        | build dev version of project (without code optimizations)
`build`            | build production-ready project (with code optimizations)

### Other tasks
Task name          | Description                                                      
:------------------|:----------------------------------
`sass` 	           | compile .sass/.scss to .css. We also use [postcss](https://github.com/postcss/postcss), so feel free to include other awesome postcss [plugins](https://github.com/postcss/postcss#plugins) when needed
`webpack`          | compile .js sources into bundle file
`copy`             | copy common files from `./src` path to `./build` path
`nunjucks`         | compile Mozilla's awesome [nunjucks](https://mozilla.github.io/nunjucks/) templates
`svgo`             | optimize svg files with [svgo](https://github.com/svg/svgo)
`svgicons`         | take .svg sources from `./icons` clean and create .html files in `./templates/partials/icons` to use it inline
`sprite-png`       | create png sprites
`sprite-svg`       | create svg sprites
`server`           | run dev-server powered by [BrowserSync](https://www.browsersync.io/)
`clean`            | remove `./build` folder
`list-pages`       | create index file with links to all project pages

_All available tasks are placed in a folder `./gulp/tasks` as separate *.js files. Usually, file name = task name._


## Flags

We have several useful flags.

* `gulp --open` or `gulp server --open` - run dev server and then open preview in browser
* `gulp [task_name] --prod` or `gulp [task_name] --production` - run task in production mode. Some of the tasks (like, sass or js compilation) have additional settings for production mode (such as code minification), so with this flag you can force production mode. `gulp build` uses this mode by default.

## Multilanguage version

If you need a multilanguage version of project, you can create folder `languages` in `src` directory, then create subdirectories with data files.  
Each subdirectory requires `global.json` file, with some general data. Optionaly, you can add other `json` files, with data to specific page. The names of the files has to be equivalent to project pages names. 
Data from `json` files can be used in page template as variables.  
In build folder would be generated files with different language versions. Amount of pages would be equivalent to amount of `languages` folder subdirectories, filenames would have suffix, equivalent to subdirection name.  

### Structure example

#### Source:
    .
    ├── ...
    ├── src                    
    │   ├── languages             
    │   │   ├── en             
    │   │   │   ├── global.json
    │   │   │   ├── page.json
    │   │   ├── ru             
    │   │   │   ├── global.json
    │   │   │   ├── page.json
    │   ├── templates             
    │   │   ├── page.html
    │   │   └── ...
    │   └── ...
    └── ...

#### Generated:
    .
    ├── ...
    ├── build                    
    │   ├── page-en.html             
    │   ├── page-ru.html
    └── ...
### Handling data example

#### JSON structure
```json
// languages/en folder
// global.json
{
  "sitename": "My awesome site"
}
// page.json
{
  "title": "Main page"
}

// languages/ru folder
// global.json
{
  "sitename": "Мой крутой сайт"
}
// page.json
{
  "title": "Главная страница"
}
```
#### HTML template
```html
<!-- Development -->

 <!-- templates/page.html -->
<h1>{{ sitename }}</h1>
<h2>{{ title }}</h2>

<!-- Generated -->

<!-- build/page-en.html -->
<h1>My awesome site</h1>
<h2>Main page</h2>

<!-- build/page-ru.html -->
<h1>Мой крутой сайт</h1>
<h2>Главная страница</h2>
```

## Other

You can also use [npm scripts](https://docs.npmjs.com/misc/scripts):

* `npm run start` - same as `gulp default`.
* `npm run build` - same as `gulp build`.
* `npm run ghpages` to push only `./build` folder to **gh-pages** branch on github (very useful for previews).
