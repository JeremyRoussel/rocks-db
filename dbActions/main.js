const getTableData = (req, res, db) => {
    db.select('*').from('catalogue')
      .then(items => {
          console.log(items)
        if(items.length){
          res.json(items)
        } else {
          res.json({dataExists: 'false'})
        }
      })
      .catch(err => res.status(400).json({dbError: 'db error'}))
}

const addSampleData = (req, res, db) => {
  const { id, name, project, user, field, well, thumbnail} = req.body
  console.log(req.body)
  db('catalogue').insert({name, project, user, field, well, thumbnail})
  .returning('*')
  .then(item => res.json(item))
  .catch(err => res.status(400).json({dbError: 'db error'}))
}

const putSampleData = (req, res, db) => {
  const {id, name, project, user, field, well, thumbnail} = req.body
  console.log(req.body)
  db('catalogue').where({id}).update({name, project, user, field, well, thumbnail})
  .returning('*')
  .then(item => {
    res.json(item)
  })
  .catch(err => res.status(400).json({dbError: 'db error'}))
}

// getSampleImages intakes the url parameter for id sent to the server
// int must be an integer!!
const getSampleImages = (req, res, db, id) => {
  db('thin_section').where({'sampleID': id}).select('*')
  .then(items => {
    console.log(items)
    if(items.length){
      res.json(items)
    } else {
      res.json({dataExists: 'false'})
    }
  })
  .catch(err => res.status(400).json({dbError: 'db error'}))
}
  
module.exports = {
    getTableData,
    addSampleData,
    putSampleData,
    getSampleImages
  }