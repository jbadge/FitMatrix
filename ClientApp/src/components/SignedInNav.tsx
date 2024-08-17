import React from 'react'
// import { Link } from 'react-router-dom'
import { getUser, logout } from '../types/auth'
import avatar from '../../images/avatar.png'

const SignedInNav = () => {
  const user = getUser()

  function handleLogout() {
    logout()

    window.location.assign('/')
  }

  return (
    <nav>
      <ul>
        <li>
          {/* <Link to="/" className="log-values">
            <i className="fa fa-plus"></i> Log Daily Values
          </Link> */}
          <a
            href="/"
            className="link"
            onClick={function (event) {
              event.preventDefault()
              handleLogout()
            }}
          >
            Sign out
          </a>
          <p className="welcome">Welcome back, {user.fullName}!</p>
        </li>

        <li className="avatar">
          <img
            src={avatar}
            alt={`${user.fullName} Avatar`}
            height="64"
            width="64"
          />
        </li>
      </ul>
    </nav>
  )
}

export default SignedInNav
