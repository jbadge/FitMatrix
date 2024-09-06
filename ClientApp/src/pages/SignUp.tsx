import React from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from 'react-query'
import { APIError, NewUserType } from '../types/types'

async function submitNewUser(newUser: NewUserType) {
  const response = await fetch('/api/Users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newUser),
  })

  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

export function SignUp() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')

  const [newUser, setNewUser] = React.useState<NewUserType>({
    fullName: '',
    email: '',
    password: '',
    stats: {},
    goal: {},
    progress: {},
  })

  const createUserMutation = useMutation(
    (newUser: NewUserType) => submitNewUser(newUser),
    {
      onSuccess: function () {
        navigate('/')
      },
      onError: function (error: APIError) {
        setErrorMessage(Object.values(error.errors).join('. '))
      },
    }
  )

  function handleStringFieldChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const value = event.target.value
    const fieldName = event.target.name

    const updatedUser = { ...newUser, [fieldName]: value }

    setNewUser(updatedUser)
  }

  return (
    <main className="page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Sign Up</h2>
      </nav>

      <form
        onSubmit={(event) => {
          event.preventDefault()

          createUserMutation.mutate(newUser)
        }}
      >
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <p className="form-input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="fullName"
            value={newUser.fullName}
            onChange={handleStringFieldChange}
          />
        </p>

        <p className="form-input">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleStringFieldChange}
          />
        </p>

        <p className="form-input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleStringFieldChange}
          />
        </p>

        <p>
          <input type="submit" value="Submit" />
        </p>
      </form>
    </main>
  )
}
