import React from 'react'
import { Button, Card } from 'react-bootstrap'

const RecipeCard = ({ title, description, handleUpdate, handleDelete }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <div className="footer-btns">
          <Button variant="outline-danger" onClick={handleDelete}>Delete</Button>{' '}
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default RecipeCard