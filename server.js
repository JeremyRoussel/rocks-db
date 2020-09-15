const express = require('express');

require('dotenv').config();

// Express Middleware
const helmet = require('helmet') // creates headers that protect from attacks (security)
const bodyParser = require('body-parser') // turns response into usable format
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests
var multer = require('multer')


// Import DB with knex and pg
var db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'postgres',
      database : 'rock-catalogue'
    }
});

// Multer Storage Function
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'uploads/thin-sections')
},
filename: function (req, file, cb) {
  cb(null, file.originalname )
}
})

// Multer Instance
var upload = multer({ storage: storage })

// Multer Thin Sections
// var multerTS = upload.single('image')

// Import DB Actions
const main = require('./dbActions/main')

// Instantiate App
const app = express()

//App Middleware for controlling DB Access, only allows port 3000 on localhost
const whitelist = ['http://localhost:3000']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(helmet())  // modifies headers to prevent attacks
app.use(cors(corsOptions))  // access control by requesting page
app.use(bodyParser.json())
app.use(morgan('combined')) // use 'tiny' or 'combined'
app.use(express.static('uploads'))

// App Routes - Auth
app.get('/', (req, res) => res.send('hello world'))
app.get('/catalogue', (req, res) => main.getTableData(req, res, db))
app.post('/catalogue', (req, res) => main.addSampleData(req, res, db))
app.put('/catalogue', (req, res) => main.putSampleData(req, res, db))

app.get('/images/:id', (req, res) => {
  main.getSampleImages(req, res, db, req.params.id)
})

// Multer File Route
app.post('/uploadTS', upload.single('image'), async (req, res) => {
  console.log(req.file)
  const file = req.file
  // console.log(`sampleID`, req.body.sampleID)
  if (!req.body.sampleID) {
    const error = new Error('Include the sampleID in uploads')
    error.httpStatusCode = 423
    res.send(error)
  }

  let sampleID = req.body.sampleID
  let file_loc = 'http://localhost:3001/thin-sections/' + file.originalname
  
  const dbEntry = await db('thin_section').insert({sampleID, file_loc})
    .returning('*')
    .then(item => {
      console.log(item)
    })
    .catch(error => {
      console.error(error)
    })

  res.send(file)
})
     

// App Server Connection
app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT || 3001}`)
})