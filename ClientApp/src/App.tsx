import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { isLoggedIn } from './types/auth'
import SignedInNav from './components/SignedInNav'
import SignedOutNav from './components/SignedOutNav'

import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'

import UserWrapper from './components/UserWrapper'

import SignedOutTdee from './pages/SignedOutTdee'
import SignedInHomePage from './pages/SignedInHomePage'

import { UserContextProvider } from './context/UserContext'

export function App() {
  return (
    <UserContextProvider>
      <>
        <header>{isLoggedIn() ? <SignedInNav /> : <SignedOutNav />}</header>

        <Routes>
          <Route
            path="/"
            element={isLoggedIn() ? <SignedInHomePage /> : <SignedOutTdee />}
          />
          <Route path="/users/:id/*" element={<UserWrapper />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>

        <footer>
          <p>
            Built with <i className="fa fa-heart"></i> in Santa Ana, California.
          </p>
        </footer>
      </>
    </UserContextProvider>
  )
}
