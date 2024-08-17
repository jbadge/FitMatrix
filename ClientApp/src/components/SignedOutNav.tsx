import React from 'react'
import { Link } from 'react-router-dom'

const SignedOutNav = () => {
  return (
    <ul>
      <li>
        <nav>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      </li>
    </ul>
  )
}

export default SignedOutNav
