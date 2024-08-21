import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Calories from './pages/Calories'
import User from './pages/User'

import { isLoggedIn } from './types/auth'
import SignedInNav from './components/SignedInNav'
import SignedOutNav from './components/SignedOutNav'

import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'

export function App() {
  return (
    <>
      <header>{isLoggedIn() ? <SignedInNav /> : <SignedOutNav />}</header>
      {/* <ul>
        <li>
          <nav>
            <Link to="/new">
              <i className="fa fa-plus"></i> Calories
            </Link>
            <Link to="/signup">sign Up</Link>
          </nav>
        </li>
      </ul> */}
      <Routes>
        <Route path="/" element={<Calories />} />
        <Route path="/user" element={<User />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>

      <footer>
        <p>
          Built with <i className="fa fa-heart"></i> in Santa Ana, California.
        </p>
      </footer>
    </>
  )
}
