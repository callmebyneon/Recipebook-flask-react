import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth, logout } from '../auth'

const LoggedInLinks = () => {
  const navigate = useNavigate()

  const handleLoggingOut = (event) => {
    event.preventDefault()

    logout()
    navigate('/')
  }
  
  return (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/">Home</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/create-recipe">Recipe</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/logout" onClick={(e) => handleLoggingOut(e)}>Logout</NavLink>
      </li>
    </>
  )
}

const LoggedOutLinks = () => {
  return (
    <>
      <li className="nav-item">
        <NavLink className="nav-link" to="/">Home</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/signup">Signup</NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/login">Login</NavLink>
      </li>
    </>
  )
}

const Navbar = () => {
  const [ logged ] = useAuth()
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">Recipebook</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar