import React, { useState } from 'react'
// import { useForm } from 'react-hook-form'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import RecipeForm from '../components/RecipeForm'

const RecipePage = () => {
  const navigate = useNavigate()

  const [newItem, setNewItem] = useState("")
  
  const onSubmit = (data, e) => {
    // console.log(data)

    const token = localStorage.getItem('access_token')

    // console.log(token)
    
    const requestOptions = {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(token)}`
      },
      body: JSON.stringify(data)
    }

    fetch('/recipe/recipes', requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setNewItem(JSON.stringify(data, null, 2))
      })
      .catch(console.error)
  }
  
  return (
    <div className="page-recipe container">
      <h2>
        Add New Recipe
        {' '}
        <Button
          variant="dark"
          style={{ verticalAlign: 'top' }}
          onClick={() => { navigate('/') }}
        >All recipes</Button>
      </h2>
      <RecipeForm onSubmit={onSubmit} />
      <br />
      <br />
      {newItem !== "" ? <CodeBlock text={newItem} /> : null}
    </div>
  )
}

export default RecipePage