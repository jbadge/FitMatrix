import React from 'react'

export function App() {
  return (
    <main className="calories-page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
      </nav>
      <h1>FitMatrix</h1>
      <div className="calories-container">
        <div className="calories-input-container">
          <div className="input-stats">Enter today&apos;s weight:</div>
          <div className="input-user">Weight</div>
          <div className="input-stats">Enter today&apos;s total calories:</div>
          <div className="input-user">Calories</div>
        </div>
        <div className="user-stats">
          <div>BMR (Mifflin St. Jeor):</div>
          {/* BMR (Males) in Kcals/day = 9.99 (weight in kg) + 6.25 (height in cm) – 4.92 (age in years) + 5 */}
          <div>
            BMR (Katch-McArdle):
            {/* Show if know %? */}
          </div>
          <div>RMR:</div>
          <div>Steps:</div>
          <div>TDEE (Mifflin St. Jeor):</div>
          <div>
            TDEE (Katch-McArdle):
            {/* Show if know %? */}
          </div>
          <div>TDEE (Calculated from personal data):</div>
        </div>
      </div>
      <footer>{/* Something here */}</footer>
    </main>
  )
}
