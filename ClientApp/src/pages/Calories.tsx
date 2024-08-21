import React from 'react'

const Calories = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <main className="calories-page">
      <h1>FitMatrix</h1>
      <div className="calories-container">
        <div className="calories-input-container">
          {/* <div className="calories-input-stats">
            Enter today&apos;s weight:</div>
          </div> */}

          <form className="calories-input-container" onSubmit={handleSubmit}>
            <p className="form-input">
              <label htmlFor="weight">Enter today&apos;s weight:</label>
              {/* Remove name=input? */}
              <input type="number" name="weight input" placeholder="Weight" />
            </p>
            {/* <p>
              <input type="submit" value="Submit" />
            </p> */}
            <p className="form-input">
              <label htmlFor="calories">
                Enter today&apos;s total calories:
              </label>
              <input
                type="number"
                name="calories input"
                placeholder="Calories"
              />
            </p>
            <p>
              <input type="submit" value="Submit" />
            </p>
          </form>
        </div>
        <div className={`calories-user-stats ${isSubmitted ? 'show' : ''}`}>
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
