import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { isLoggedIn } from './types/auth'
import SignedInNav from './components/SignedInNav'
import SignedOutNav from './components/SignedOutNav'

import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import NewProgressEntry from './pages/NewProgressEntry'

import UserStats from './pages/UserStats'
import UserInfo from './pages/UserInfo'

export function App() {
  return (
    <>
      <header>{isLoggedIn() ? <SignedInNav /> : <SignedOutNav />}</header>

      <Routes>
        {/* NEED INFO BACK IN THERE BUT WANTED DEFAULT TO NPE */}
        <Route path="/users/:id/info" element={<UserInfo />} />
        <Route path="/new" element={<NewProgressEntry />} />
        <Route path="/" element={<NewProgressEntry />} />
        <Route path="/users/:id" element={<UserStats />} />
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
