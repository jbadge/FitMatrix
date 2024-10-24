import React from 'react'
import { Link } from 'react-router-dom'

import { getUser, logout } from '../types/auth'
import avatar from '../../images/avatar.png'

const SignedInNav = () => {
  const user = getUser()
  // const { id } = useParams() as { id: string }

  function handleLogout() {
    logout()

    window.location.assign('/')
  }
  {
    /* <Link to="/" className="log-values">
            <i className="fa fa-plus"></i> Log Daily Values
          </Link> */
  }

  return (
    <ul>
      <li>
        <nav className="navbar-container">
          <a href={`/`}>
            <i className="fa fa-home"></i>
          </a>
          <div className="navbar">
            <Link
              to="/"
              className="link"
              onTouchStart={(event) => {
                event.preventDefault()
                handleLogout()
              }}
              onClick={(event) => {
                event.preventDefault()
                handleLogout()
              }}
            >
              Sign out
            </Link>

            <p className="welcome">
              <span className="nowrap">Welcome back,</span>
              <Link to={`/Users/${user.id}`} className="userLink">
                {/* <span className="nowrap"> */}
                {user.fullName}!{/* </span> */}
              </Link>
            </p>
          </div>
          <li className="avatar">
            <img
              src={avatar}
              alt={`${user.fullName} Avatar`}
              height="64"
              width="64"
            />
          </li>
        </nav>
      </li>
      {/* <li className="avatar">
        <img
          src={avatar}
          alt={`${user.fullName} Avatar`}
          height="64"
          width="64"
        />
      </li> */}
    </ul>
  )
}

export default SignedInNav
