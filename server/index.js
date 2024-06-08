const express = require('express')
const app = express()
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = mysql.createPool({
  host: `${window.location.origin}`,
  user: 'root',
  password: '',
  database: 'food_expiry',
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/get', (req, res) => {
  const sqlSelect = 'SELECT * FROM food_items ORDER BY expiry'
  db.query(sqlSelect, (err, result) => {
    res.send(result)
  })
})

app.post('/api/insert', (req, res) => {
  const type = req.body.type
  const brand = req.body.brand
  const expiry = req.body.expiry

  const sqlInsert =
    'INSERT INTO food_items (type, brand, expiry) VALUES (?,?,?)'
  db.query(sqlInsert, [type, brand, expiry], (err, result) => {
    res.send(result)
  })
})

app.delete('/api/delete/:id', (req, res) => {
  const id = req.params.id
  const sqlDelete = 'DELETE FROM food_items WHERE id = ?'
  db.query(sqlDelete, id, (err, result) => {
    if (err) console.log(err)
  })
})

app.listen(process.env.PORT | PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
