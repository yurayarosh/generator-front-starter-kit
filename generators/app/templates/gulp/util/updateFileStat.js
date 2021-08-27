import through2 from 'through2'

const updateFileStat = () =>
  through2.obj((file, enc, cb) => {
    if (file.stat) {
      file.stat.atime = file.stat.mtime = file.stat.ctime = new Date()
    }
    cb(null, file)
  })

export default updateFileStat
