import React from 'react'

const Calories = () => {
  return (
    <main className="calories-page">
      <h1>FitMatrix</h1>
      <div className="calories-container">
        <div className="calories-input-container">
          <div className="calories-input-stats">Enter today&apos;s weight:</div>
          <div className="calories-input-user">Weight</div>
          <div className="calories-input-stats">
            Enter today&apos;s total calories:
          </div>
          <div className="calories-input-user">Calories</div>
        </div>
        <div className="calories-user-stats">
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
    </main>
  )
}

export default Calories
