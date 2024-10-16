import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { isLoggedIn } from './types/auth'
import SignedInNav from './components/SignedInNav'
import SignedOutNav from './components/SignedOutNav'

import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
// import NewProgressEntry from './pages/Progress'

import UserStats from './pages/UserPage'
import UserInfo from './pages/UserInfo'
import Progress from './pages/Progress'
import SignedOutTdee from './pages/SignedOutTdee'
import SignedInHomePage from './pages/SignedInHomePage'

export function App() {
  return (
    <>
      <header>{isLoggedIn() ? <SignedInNav /> : <SignedOutNav />}</header>

      <Routes>
        {/* NEED INFO BACK IN THERE BUT WANTED DEFAULT TO NPE */}

        <Route
          path="/"
          element={isLoggedIn() ? <SignedInHomePage /> : <SignedOutTdee />}
        />
        <Route path="/users/:id" element={<UserStats />} />
        <Route path="/users/:id/info" element={<UserInfo />} />
        <Route path="/users/:id/Progress" element={<Progress />} />
        {/* <Route path="/users/:id/Progress/:id" element={<Progress />} /> */}
        {/* <Route path="/new" element={<NewProgressEntry />} /> */}

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
