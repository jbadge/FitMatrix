import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Calories from './pages/Calories'
import User from './pages/User'
import { isLoggedIn } from './types/auth'
import SignedInNav from './components/SignedInNav'
import SignedOutNav from './components/SignedOutNav'

export function App() {
  return (
    <>
      <header>{isLoggedIn() ? <SignedInNav /> : <SignedOutNav />}</header>
      <Routes>
        <Route path="/" element={<Calories />} />
        <Route path="/user" element={<User />} />
      </Routes>

      <footer>
        <p>
          Built with <i className="fa fa-heart"></i> in Santa Ana, California.
        </p>
      </footer>
    </>
  )
}
