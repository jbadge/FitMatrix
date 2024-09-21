import React from 'react'
import { APIError, LoginSuccess, LoginUserType } from '../types/types'
import { useMutation } from 'react-query'
import { recordAuthentication } from '../types/auth'

async function loginUser(user: LoginUserType): Promise<LoginSuccess> {
  const response = await fetch('/api/Sessions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(user),
  })

  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

export function SignIn() {
  const [errorMessage, setErrorMessage] = React.useState('')
  // const { id } = useParams() as { id: string }

  const [user, setUser] = React.useState<LoginUserType>({
    email: '',
    password: '',
  })

  const loginUserMutation = useMutation(loginUser, {
    onSuccess: function (apiResponse) {
      recordAuthentication(apiResponse)
      const id = apiResponse.user.id

      window.location.assign(`/Users/${id}/Progress`)
    },
    onError: function (error: APIError) {
      setErrorMessage(Object.values(error.errors).join(' '))
    },
  })

  function handleStringFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const fieldName = event.target.name

    const updatedUser = { ...user, [fieldName]: value }

    setUser(updatedUser)
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('user: ', user)
    // debugger
    loginUserMutation.mutate(user)
  }

  return (
    <main className="user-page">
      <nav className="navbar-container">
        {/* <a href={`/users/${id}/Progress`}>
          <i className="fa fa-home"></i>
        </a>
        <h2>Sign In</h2> */}
      </nav>
      <h1>FitMatrix</h1>
      <div className="user-container">
        <form onSubmit={handleFormSubmit}>
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <p className="form-input">
            <label htmlFor="name">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleStringFieldChange}
            />
          </p>
          <p className="form-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
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
