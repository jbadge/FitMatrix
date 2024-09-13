import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation } from 'react-query'
import { APIError, NewUserType } from '../types/types'

async function submitNewUser(newUser: NewUserType) {
  console.log('submitNewUser: ', newUser)

  const response = await fetch('/api/Users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newUser),
  })
  console.log(response)
  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

export function SignUp() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')
  const { id } = useParams() as { id: string }
  const [newUser, setNewUser] = React.useState<NewUserType>({
    fullName: '',
    email: '',
    password: '',
    stats: [],
    // {
    //   age: 0,
    //   sex: 'M',
    //   heightMetric: 0,
    //   heightImperial: 0,
    //   weightMetric: 0,
    //   weightImperial: 0,
    //   activityLevel: 1.2,
    //   activityLevelLabel: 'Sedentary',
    // },
    goal: [],
    // {
    //   goalSelection: 'maintain',
    //   goalWeight: 0,
    //   goalRate: 0,
    //   goalBfp: 0,
    //   goalDate: new Date(),
    // },
    progress: [],
    // {
    //   weightMetric: 0,
    //   weightImperial: 0,
    //   calories: 0,
    // },
  })

  // Make user stayed signed in
  const createUserMutation = useMutation(
    (newUser: NewUserType) => submitNewUser(newUser),
    {
      onSuccess: function () {
        console.log('newUser: ', newUser)

        navigate(`/users/${id}/Progress`)
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
    console.log('updatedUser: ', updatedUser)
    setNewUser(updatedUser)
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    createUserMutation.mutate(newUser)
  }

  return (
    <main className="user-page">
      <nav className="navbar-container">
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
        <h2>Sign Up</h2>
      </nav>
      <h1>FitMatrix</h1>
      <div className="user-container">
        <form onSubmit={handleFormSubmit}>
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
      </div>
    </main>
  )
}
