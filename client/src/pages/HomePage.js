import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button, Stack, Modal } from 'react-bootstrap'
import { useAuth } from '../auth'
import RecipeCard from '../components/RecipeCard'
import RecipeForm from '../components/RecipeForm'
import CodeBlock from '../components/CodeBlock';

const UpdateModal = ({ show, onClose, onUpdate, targetRecipe }) => {
  const handleUpdate = (data, e) => {
    console.log(data)
    console.log(targetRecipe.id)

    if (typeof targetRecipe?.id === "number") {
      const token = localStorage.getItem('access_token')
  
      const requestOptions = {
        method: "PUT",
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(token)}`
        },
        body: JSON.stringify(data)
      }
  
      fetch(`/recipe/recipe/${targetRecipe.id}`, requestOptions)
        .then(res => res.json())
        .then(data => {
          console.dir(data)
          onUpdate()
        })
        .catch(console.error)
    }
  }

  return (
    <Modal
      id="update-modal"
      show={show}
      size="lg"
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Update</p>
        <RecipeForm
          submitText="Update"
          defaultValue={targetRecipe}
          cancelProp={{
            style: {
              marginLeft: 'auto'
            }
          }}
          onCancel={onClose}
          onSubmit={handleUpdate}
        />
      </Modal.Body>
    </Modal>
  )
}

const DeleteModal = ({ show, onClose, onUpdate, targetRecipe }) => {
  const handleDeleteRecipe = (recipe) => {
    console.log(recipe)

    if (typeof targetRecipe?.id === "number") {
      const token = localStorage.getItem('access_token')

      const requestOptions = {
        method: "DELETE",
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(token)}`
        }
      }
      
      fetch(`/recipe/recipe/${targetRecipe.id}`, requestOptions)
        .then(res => res.json())
        .then(data => {
          console.dir(data)
          onClose()
          onUpdate()
        })
        .catch(console.error)
    }
  }

  return (
    <Modal
      show={show}
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ textAlign: "center", fontSize: "1.4rem" }}>Are you really DELETE this Recipe?</p>
        <CodeBlock text={JSON.stringify(targetRecipe, null, 2)} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => handleDeleteRecipe(targetRecipe)}>Delete</Button>
      </Modal.Footer>
    </Modal>
  )
}

const LoggedInHome = () => {
  const navigate = useNavigate()

  const [recipes, setRecipes] = useState([])

  const [modalShow, setModalShow] = useState(false)
  const [confirmShow, setConfirmShow] = useState(false)
  const [targetRecipe, setTargetRecipe] = useState({})
  
  const getAllRecipes = () => {
    fetch('/recipe/recipes')
      .then(res => res.json())
      .then(setRecipes)
      .catch(console.error)
  }

  useEffect(() => {
    getAllRecipes()
  }, [])

  const handleTargetRecipe = (recipe) => {
    // console.log(recipe)
    setTargetRecipe(recipe)
  }
  
  const handleShowModal = (recipe) => {
    handleTargetRecipe(recipe)
    setModalShow(true)
  }

  const handleShowConfirm = (recipe) => {
    handleTargetRecipe(recipe)
    setConfirmShow(true)
  }
  
  return (
    <div className="recipes">
      <UpdateModal
        show={modalShow}
        onClose={() => setModalShow(false)}
        onUpdate={getAllRecipes}
        targetRecipe={targetRecipe}
      />
      <DeleteModal
        show={confirmShow}
        onClose={() => setConfirmShow(false)}
        onUpdate={getAllRecipes}
        targetRecipe={targetRecipe}
      />
      <h2>
        List of Recipes
        {' '}
        <Button
          variant="dark"
          style={{ verticalAlign: 'top' }}
          onClick={() => { navigate('/create-recipe') }}
        >Create new recipe</Button>
      </h2>
      <br />
      {recipes.length > 0
        ? (
          <Stack gap={3}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={`recipe-${recipe.id}`}
                title={recipe.title}
                description={recipe.description}
                handleUpdate={() => handleShowModal(recipe)}
                handleDelete={() => handleShowConfirm(recipe)}
              />
            ))}
          </Stack>
        ) : null}
      <br />
    </div>
  )
}

const LoggedOutHome = () => {
  return (
    <div className="welcome">
      <h2 className="heading">Welcome to the Recipebook</h2>
      <div className="nav-btns">
        <NavLink to="/signup" role="button" className="btn btn-primary">Sign up</NavLink>{' '}or{' '}
        <NavLink to="/login" role="button" className="btn btn-outline-primary">Login</NavLink>{' '}and get started!
      </div>
    </div>
  )
}

const HomePage = () => {
  const [ logged ] = useAuth()
  
  return (
    <div className="page-home container">
      {logged ? <LoggedInHome /> : <LoggedOutHome />}
    </div>
  )
}

export default HomePage