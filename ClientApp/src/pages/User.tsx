import React from 'react'

const User = () => {
  return (
    <main className="user-page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
      </nav>
      <h1>FitMatrix</h1>
      <div className="user-container">
        <div className="user-input-container">
          Enter Your Details
          <div className="user-input-user">Age</div>
          <div className="user-input-user">Sex</div>
          <div className="user-input-user">Height</div>
          <div className="user-input-user">Weight</div>
        </div>
        <div className="user-user-goals">
          What goal would you like to achieve?
          <div>
            Lose Fat <span className="goal-input">lbs</span>
          </div>
          {/* 1% bodyfat per week max */}
          <div>
            Gain Muscle <span className="goal-input">lbs</span>
          </div>
          {/* 0.5 - 2lbs max per month */}
          <div>Maintain</div>
          <div>Goal Date</div>
          {/* Does the goal dictate the date, and/or the date can dictate the rate */}
          {/* If goal date conflicts with parameters above for loss/gain, default to soonest */}
        </div>
      </div>
      <footer>{/* Something here */}</footer>
    </main>
  )
}

export default User
