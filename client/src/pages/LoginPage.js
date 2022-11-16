import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Form, Button, Alert } from 'react-bootstrap'
import { login } from '../auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const [showPassword, setShowPassword] = useState(false)
  const [serverResponse, setServerResponse] = useState('')

  const onSubmit = (data, _) => {
    // console.log(data)
    
    const requestOptions = {
      method: "POST",
      headers: {
        'content-type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    }
  
    fetch('/auth/login', requestOptions)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        if (data?.access_token) {
          login(data.access_token)
          navigate('/')
        } else {
          setServerResponse("Wrong access")
        }
      })
      .catch(console.error)

    reset()
  }

  return (
    <div className="page-signup container">
      <div>
        <h2>Login Page</h2>

        {(serverResponse !== "")
          ? (
            <Alert variant="danger" onClose={() => setServerResponse("")} dismissible>
              <strong>{serverResponse}</strong>
            </Alert>
          ) : null}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Username<span className="text-primary">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Your username"
              maxLength="25"
              {...register("username", { required: true, maxLength: 25 })}
            />
            {errors.username
              ? errors.username.type !== "maxLength"
                ? <p className="error-msg text-danger"><small>Username is required</small></p>
                : <p className="error-msg text-danger"><small>Max characters should be 25</small></p>
              : null}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Password<span className="text-primary">*</span></Form.Label>
            <Form.Control
              type={showPassword ? "text": "password"}
              placeholder="Your password"
              minLength="8"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password
              ? errors.password.type !== "minLength"
                ? <p className="error-msg text-danger"><small>Password is required</small></p>
                : <p className="error-msg text-danger"><small>Min characters should be 80</small></p>
              : null}
            <Form.Check 
              type="checkbox"
              id="toggle-password-type"
              label="show password"
              style={{ marginTop: "0.5em" }}
              checked={showPassword}
              onChange={() => setShowPassword(prevState => !prevState)}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Button type="submit" role="button">Login</Button>
          </Form.Group>
        </form>
        <p>
          <small>Do not have an account? <NavLink to="/signup">Create account here.</NavLink></small>
        </p>
      </div>
    </div>
  )
}

export default LoginPage