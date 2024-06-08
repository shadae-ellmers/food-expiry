import './App.css'
import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function App() {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [expiry, setExpiry] = useState('')
  const [foodList, setFoodList] = useState([])

  useEffect(() => {
    Axios.get('http://localhost:3001/api/get').then((response) => {
      setFoodList(response.data)
    })
  }, [])

  const submitHandler = (e) => {
    e.preventDefault()
    Axios.post('http://localhost:3001/api/insert', {
      type: name,
      brand: brand,
      expiry: expiry,
    }).then((response) => {
      const newList = [
        ...foodList,
        {
          id: response.data.insertId,
          type: name,
          brand: brand,
          expiry: expiry,
        },
      ]
      newList.sort((a, b) => new Date(a.expiry) - new Date(b.expiry))
      setFoodList(newList)
    })
  }

  const deleteHandler = (id) => {
    Axios.delete(`http://localhost:3001/api/delete/${id}`)
    setFoodList(
      foodList.filter((item) => {
        return item.id !== id
      })
    )
  }

  const handleDate = (itemDate) => {
    const dateString = itemDate.toString()
    const dateSplit = dateString.split('T')[0]
    return dateSplit
  }

  return (
    <div className="App">
      <h1>Food Expiry Tracker</h1>
      <p>Add food:</p>
      <form>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="brand">Brand: </label>
        <input
          type="text"
          name="brand"
          onChange={(e) => setBrand(e.target.value)}
        />
        <label htmlFor="expiry">Expiry: </label>
        <input
          type="date"
          name="expiry"
          onChange={(e) => setExpiry(e.target.value)}
        />
        <button onClick={submitHandler}>Submit</button>
      </form>
      {foodList.map((item) => (
        <div key={'food-item_' + item.id}>
          <h2>{item.type}</h2>
          <h3>{item.brand}</h3>
          <p>{handleDate(item.expiry)}</p>
          <p>{item.id}</p>
          <button
            onClick={() => {
              deleteHandler(item.id)
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default App
