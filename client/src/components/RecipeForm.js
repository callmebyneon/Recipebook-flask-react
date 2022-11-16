import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, FloatingLabel } from 'react-bootstrap'

const RecipeForm = ({ submitText, defaultValue, cancelProp, onCancel, onSubmit }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm()
  
  // only works when components rendered
  useEffect(() => {
    if (defaultValue?.id) {
      setValue("title", defaultValue.title)
      setValue("description", defaultValue.description)
    }
  // eslint-disable-next-line
  }, [])
  
  const handleValid = (data, e) => {
    onSubmit(data, e)

    if (typeof onCancel === "function") {
      onCancel()
    }

    reset()
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleValid)}>
          <Form.Group>
            <FloatingLabel
              controlId="recipeTitle"
              label="Recipe title"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Your recipe title"
                {...register("title", { required: true, maxLength: 100 })}
              />
              <p className="character-count text-muted"><small>{watch("title")?.length || 0}/100</small></p>
              {errors.title
                ? errors.title.type !== "maxLength"
                  ? <p className="error-msg text-danger"><small>Title is required</small></p>
                  : <p className="error-msg text-danger"><small>It's too long! Max characters should be 100</small></p>
                : null}
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel
              controlId="recipeDescription"
              label="Recipe description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Your recipe description"
                style={{ height: '200px' }}
                {...register("description", { required: true, maxLength: 255 })}
              />
              <p className="character-count text-muted"><small>{watch("description")?.length || 0}/255</small></p>
              {errors.description
                ? errors.description.type !== "maxLength"
                  ? <p className="error-msg text-danger"><small>Description is required</small></p>
                  : <p className="error-msg text-danger"><small>It's too long! Max characters should be 255</small></p>
                : null}
            </FloatingLabel>
        </Form.Group>
      </form>
      <div className="form-btns">
        {(typeof onCancel === "function") ? (
          <>
            <Button
              type="cancel"
              variant="secondary"
              onClick={onCancel}
              {...cancelProp}
            >
              Cancel
            </Button>
          </>
        ) : null}
        <Button type="submit" onClick={handleSubmit(handleValid)}>{submitText || "Save"}</Button>
      </div>
    </>
  )
}

export default RecipeForm