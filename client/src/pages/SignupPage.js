import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Form, Button, Alert } from 'react-bootstrap'

const SignupPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [serverResponse, setServerResponse] = useState('')

  const onSubmit = (data, event) => {
    // console.log(data)

    if (data.password === data.confirmPassword) {
      const bodyData = {
        username: data.username,
        email: data.email,
        password: data.confirmPassword
      }
      
      const requestOptions = {
        method: "POST",
        headers: {
          'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(bodyData)
      }
    
      fetch('/auth/signup', requestOptions)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (!data.success)
            setServerResponse(data?.message)
        })
        .catch((err) => {
          console.error(err)
          setServerResponse(err?.message)
        })
        
      reset()

    } else {
      setServerResponse("Password do not match")

    }
    
  }

  return (
    <div className="page-signup container">
      <div>
        <h2>Sign Up Page</h2><br />

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
            <Form.Label>Email<span className="text-primary">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Your email address"
              maxLength="80"
              {...register("email", { required: true, maxLength: 80, pattern: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+).([a-zA-Z]{2,5})$/ })}
            />
            {errors.email
              ? errors.email.type !== "maxLength"
                ? <p className="error-msg text-danger"><small>Email is required and check your email address</small></p>
                : <p className="error-msg text-danger"><small>Max characters should be 80</small></p>
              : null}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Password<span className="text-primary">*</span></Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              minLength="8"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password
              ? errors.password.type !== "minLength"
                ? <p className="error-msg text-danger"><small>Password is required</small></p>
                : <p className="error-msg text-danger"><small>Min characters should be 80</small></p>
              : null}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Confirm Password<span className="text-primary">*</span></Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password again"
              minLength="8"
              {...register("confirmPassword", { required: true, minLength: 8 })}
            />
            {errors.password
              ? errors.password.type !== "minLength"
                ? <p className="error-msg text-danger"><small>Password is required and check if the value is the same as the another one</small></p>
                : <p className="error-msg text-danger"><small>Min characters should be 80</small></p>
              : null}
          </Form.Group>
          <br />
          <Form.Group>
            <Button type="submit" role="button">Submit</Button>
          </Form.Group>
        </form>
        <p>
          <small>Do you have an account already? <NavLink to="/login">Log in here.</NavLink></small>
        </p>
      </div>
    </div>
  )
}

export default SignupPage