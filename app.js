const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const fs = require('fs')
const NullStorage = require('./storageEngine')

const multer  = require('multer')
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/tmp/uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// const upload = multer({ storage: storage })
var ourCustomStorage = NullStorage({
  destination: function (req, file, cb) {
    cb(null, '/dev/null');
  }
});

const upload = multer({ storage: ourCustomStorage() })
const logger = (req, _res, next) => {
  console.log('logger: ', req)
  next()
}


app.use(cors({
  origin: 'http://localhost:5000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}))

app.use((_req, res, next) => {
  res.setHeader('Timing-Allow-Origin', 'http://localhost:5000')
  next()
})

app.get('/favicon.ico', (_req, res) => { res.sendStatus(200) })
app.get('/image', (_req, res) => {
  res.sendFile(path.join(__dirname, './candyImage.jpg'))
})
app.get('/video', (_req, res) => {
  res.sendFile(path.join(__dirname, './download.mpg'))
})
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})
app.post('/uploadsingle', upload.single('file'), (req, res) => {
  const promiseStack = []
  const theFiles = [req.file]
  console.log('files: ', theFiles)
  for(const file of Array.from(theFiles)) {
    promiseStack.push(new Promise((resolve, reject) => {
      const tmp_path = file.path
      const target_path = '/dev/null' // path.join(__dirname, './uploads/') + file.originalname
      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)
      src.pipe(dest)
      src.on('end', () => { resolve('success') })
      src.on('error', err => { reject(err) })
    }))
  }
  Promise.all(promiseStack)
    .then(result => {
      console.log(result)
      res.status(200).send('Successfully received and parsed file')
    })
    .catch(err => {
      console.log(err)
      res.send('error')
    })
})
app.post('/upload', upload.array('data', 100), (req, res) => {
  const promiseStack = []
  const theFiles = [req.file]
  console.log('files: ', theFiles)
  for(const file of Array.from(theFiles)) {
    promiseStack.push(new Promise((resolve, reject) => {
      const tmp_path = file.path
      const target_path = '/dev/null' // path.join(__dirname, './uploads/') + file.originalname
      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)
      src.pipe(dest)
      src.on('end', () => { resolve('success') })
      src.on('error', err => { reject(err) })
    }))
  }
  Promise.all(promiseStack)
    .then(result => {
      console.log(result)
      res.status(200).redirect('/')
    })
    .catch(err => {
      console.log(err)
      res.send('error')
    })
})

app.listen(7776, '0.0.0.0', () => {
  console.log('listening on http://localhost:7776')
})
