import React, { useState } from 'react'
import GoalSlider from '../components/GoalSlider'

type GoalOptions = 'lose' | 'gain' | 'maintain'

const User = () => {
  const [goalWeightLose, setGoalWeightLose] = useState(0)
  const [goalWeightGain, setGoalWeightGain] = useState(0)

  const [age, setAge] = useState(0)
  const [sex, setSex] = useState('')
  const [height, setHeight] = useState(0)
  const [weight, setWeight] = useState(0)
  const [checkedGoals, setCheckedGoals] = useState<
    Record<GoalOptions, boolean>
  >({
    lose: false,
    gain: false,
    maintain: false,
  })

  const handleCheckboxChange = (goal: GoalOptions) => {
    setCheckedGoals((prev) => ({
      lose: goal === 'lose' ? !prev.lose : false,
      gain: goal === 'gain' ? !prev.gain : false,
      maintain: goal === 'maintain' ? !prev.maintain : false,
    }))
  }

  const handleLoseWeightChange = (value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    setGoalWeightLose(numericValue)
  }

  const handleGainWeightChange = (value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value
    setGoalWeightGain(numericValue)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  return (
    <main className="user-page">
      <nav>
        <a href="/">
          <i className="fa fa-home"></i>
        </a>
      </nav>
      <h1>FitMatrix</h1>
      <div className="user-container">
        <form className="user-input-container" onSubmit={handleSubmit}>
          Enter Your Details
          <p className="form-input">
            <label htmlFor="age">Age: </label>
            <input
              type="number"
              name="age input"
              placeholder="Age"
              value={age || ''}
              onChange={(event) => setAge(parseFloat(event.target.value))}
            />
          </p>
          <p className="form-input">
            <label htmlFor="sex">Sex: </label>
            <input
              type="text"
              name="sex input"
              placeholder="Sex"
              value={sex || ''}
              onChange={(event) => setSex(event.target.value)}
            />
          </p>
          <p className="form-input">
            <label htmlFor="height">Height: </label>
            <input
              type="number"
              name="height input"
              placeholder="Height"
              value={height || ''}
              onChange={(event) => setHeight(parseFloat(event.target.value))}
            />
          </p>
          <p className="form-input">
            <label htmlFor="weight">Weight: </label>
            <input
              type="number"
              name="weight input"
              placeholder="Weight"
              value={weight || ''}
              onChange={(event) => setWeight(parseFloat(event.target.value))}
            />
          </p>
          <div className="user-user-goals">
            <p className="goal-heading">What goal would you like to achieve?</p>
            <label>
              <div className="label-container">
                <input
                  type="checkbox"
                  checked={checkedGoals.lose}
                  onChange={() => handleCheckboxChange('lose')}
                  disabled={weight === 0}
                />
                Lose Fat
              </div>
              {checkedGoals.lose ? (
                <div className="input-container">
                  <input
                    type="number"
                    placeholder="lbs"
                    value={goalWeightLose}
                    onChange={(event) =>
                      handleLoseWeightChange(event.target.value)
                    }
                  />
                  <label htmlFor="goal-weight" className="slider-label"></label>
                  <input
                    type="range"
                    min="0"
                    max={weight * 0.01 + 0.00000001}
                    step={(weight * 0.01) / 4}
                    className="slider-input"
                    value={goalWeightLose}
                    onChange={(event) =>
                      handleLoseWeightChange(event.target.value)
                    }
                  />
                  {/* <GoalSlider /> */}
                </div>
              ) : (
                <div className="lose-placeholder">
                  <p>Up to 1% of bodyweight per week</p>
                </div>
              )}
            </label>
            <label>
              <div>
                <input
                  type="checkbox"
                  checked={checkedGoals.gain}
                  onChange={() => handleCheckboxChange('gain')}
                />
                Gain Muscle
              </div>
              {checkedGoals.gain ? (
                <div className="input-container">
                  <input
                    type="number"
                    placeholder="lbs"
                    value={goalWeightGain}
                    onChange={(event) =>
                      handleGainWeightChange(event.target.value)
                    }
                  />
                  <label htmlFor="goal-weight" className="slider-label"></label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.5"
                    className="slider-input"
                    value={goalWeightGain}
                    onChange={(event) =>
                      handleGainWeightChange(event.target.value)
                    }
                  />
                  {/* <GoalSlider /> */}
                </div>
              ) : (
                <div className="gain-placeholder">
                  <p>Up to 2lbs/1kg per week</p>
                </div>
              )}
            </label>
            <label>
              <div>
                <input
                  type="checkbox"
                  checked={checkedGoals.maintain}
                  onChange={() => handleCheckboxChange('maintain')}
                />
                Maintain
              </div>
            </label>
          </div>
          <p>
            <input type="submit" value="Submit" />
          </p>
        </form>
      </div>
    </main>
  )
}

export default User
