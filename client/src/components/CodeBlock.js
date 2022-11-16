import React from 'react'
import { Card } from 'react-bootstrap'

const CodeBlock = ({ text }) => {
  return (
    <Card bg="dark" text="white">
      <pre>{text}</pre>
    </Card>
  )
}

export default CodeBlock