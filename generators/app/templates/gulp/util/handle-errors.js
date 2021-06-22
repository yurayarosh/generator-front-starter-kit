import notify from 'gulp-notify'

module.exports = function (args) {
  notify
    .onError({
      title: 'Compile Error',
      message: '<%= error.message %>',
      sound: 'Submarine',
    })
    .apply(this, [args])
    
  this.emit('end')
}
