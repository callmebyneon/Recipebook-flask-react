import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'
import { Home, Signup, Login, Recipe } from './pages'

const Layout = () => { 
  return (
    <div>
      <Navbar />      
      <Outlet />
    </div>
  )
}


const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="create-recipe" element={<Recipe />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}


createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)