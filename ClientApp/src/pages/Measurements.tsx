import React, { useState } from 'react'

const Measurements = () => {

    // Measurements
  /////////////////////////////////////////////////
  // Need to record these measurements for the user
  const waist = 37
  const neck = 14.5
  const hips = 39
  const forearm = 11.625
  const wrist = 6.625
  const thigh = 25
  const calf = 15
  const [unit, setUnit] = useState('imperial')
  
  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric'

      setGoalInfo((prev) => {
        const newGoalWeightMetric =
          newUnit === 'metric'
            ? convertWeightToMetric(prev.goalWeight!)
            : prev.goalWeight!

        const newGoalWeightImperial =
          newUnit === 'metric'
            ? prev.goalWeight!
            : convertWeightToImperial(prev.goalWeight!)
        setGoalWeight(
          newUnit === 'metric' ? newGoalWeightMetric : newGoalWeightImperial
        )
        return {
          ...prev,
          goalWeight:
            newUnit === 'metric' ? newGoalWeightMetric : newGoalWeightImperial,
        }
      })

      setStatsInfo((prev) => {
        const newHeightMetric =
          newUnit === 'metric'
            ? prev.heightMetric!
            : convertHeightToMetric(prev.heightImperial!)
        const newHeightImperial =
          newUnit === 'imperial'
            ? prev.heightImperial!
            : convertHeightToImperial(prev.heightMetric!)
        const newWeightMetric =
          newUnit === 'metric'
            ? prev.weightMetric!
            : convertWeightToMetric(prev.weightImperial!)
        const newWeightImperial =
          newUnit === 'imperial'
            ? prev.weightImperial!
            : convertWeightToImperial(prev.weightMetric!)

        setHeight(newUnit === 'metric' ? newHeightMetric : newHeightImperial)
        setWeight(newUnit === 'metric' ? newWeightMetric : newWeightImperial)

        return {
          ...prev,
          heightMetric: newHeightMetric,
          heightImperial: newHeightImperial,
          weightMetric: newWeightMetric,
          weightImperial: newWeightImperial,
        }
      })
      return newUnit
    })
  }
  return (
    <main className="user-page">

      <h1>FitMatrix</h1>
      <div className="user-container">
        <div className="button-container">
          <button onClick={toggleUnit}>
            Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          {errorMessage ? (
            <div className="form-error">{errorMessage}</div>
          ) : null}
          <div className="user-stats">
            <div className="form-input">
              <label htmlFor="age">
                Enter Your Details
                <br />
                <br />
                Age:
              </label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={age || ''}
                onChange={handleInputChange}
                onFocus={() => handleFocus('age')}
                onBlur={handleBlurDob}
                required
              />
              {focusedField !== '' && (
                <div className="birthday-popup">
                  <div className="date-picker-age">
                    <DatePicker
                      selected={dateOfBirth}
                      onChange={(date) => {
                        if (date) {
                          setDateOfBirth(date)
                          updateAgeFromDate(date)
                          setMonth(date.getMonth() + 1)
                          setDay(date.getDate())
                          setYear(date.getFullYear())
                          setStatsInfo((prev) => ({
                            ...prev,
                            doB: date,
                          }))
                        }
                      }}
                      onFocus={() => handleFocus('dob')}
                      onBlur={handleBlurDob}
                    />
                  </div>
                  <div className="month-day-year">
                    <span>
                      <input
                        type="number"
                        name="month"
                        min={1}
                        max={12}
                        placeholder="Month"
                        value={month || ''}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('month')}
                        onBlur={handleBlurDob}
                      />
                    </span>
                    <span>
                      <input
                        type="number"
                        name="day"
                        min={1}
                        max={31}
                        placeholder="Day"
                        value={day || ''}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('day')}
                        onBlur={handleBlurDob}
                      />
                    </span>
                    <span>
                      <input
                        type="number"
                        name="year"
                        min={1940}
                        max={2100}
                        placeholder="Year"
                        value={year || ''}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('year')}
                        onBlur={handleBlurDob}
                      />
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="form-input">
              <label htmlFor="sex">Sex: </label>
              <select
                name="sex"
                value={sex || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="form-input">
              <label htmlFor="height">
                Height{unit === 'metric' ? ' (cm)' : ' (in)'}:
              </label>
              <input
                type="number"
                className="form-control"
                name="height"
                placeholder="Height"
                value={displayHeightValue || ''}
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="form-input">
              <label htmlFor="weight">
                Weight{unit === 'metric' ? ' (kg)' : ' (lbs)'}:
              </label>
              <input
                type="number"
                className="form-control"
                name="weight"
                placeholder="Weight"
                value={displayWeightValue || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-input">
              <label htmlFor="activity-level">Activity Level: </label>
              <select
                name="activityLevelLabel"
                value={activityLevelLabel}
                onChange={handleInputChange}
                required
              >
                <option value="None">None</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
                <option value="Athlete">Athlete</option>
              </select>
            </div>
          </div>
          <div className="activity-definitions">
            {/* <p>None: Almost Always Sitting or Laying.</p> */}
            <p>
              Sedentary Lifestyle: Little or No Exercise, Moderate Walking, Desk
              Job.
            </p>
            <p>
              Light Activity: Light Physical Work, Exercise or Sports 1 to 3
              Days a Week.
            </p>
            <p>
              Moderate Activity: Physical Work, Exercise, or Sports 4 to 5 Days
              a Week.
            </p>
            <p>
              Heavy Activity: Heavy Physical Work, Exercise, or Sports 6 to 7
              Days a Week.
            </p>
            <p>Athlete: Professional or Olympic Athlete.</p>
          </div>

          <div className="user-goals">
            <div className="goal-heading">
              What is your goal and goal weight?
            </div>
            <label>
              <div className="label-container">
                <input
                  type="checkbox"
                  name="lose"
                  checked={checkedGoals.lose}
                  onChange={() => handleCheckboxChange('lose')}
                  disabled={weight === 0}
                />
                Lose Fat
              </div>
              {checkedGoals.lose ? (
                <div className="input-container">
                  <input
                    className="goal-rate"
                    type="number"
                    name="lose"
                    placeholder="lbs per week"
                    value={goalRateLose}
                    onChange={handleInputChange}
                  />
                  {unit === 'imperial' ? 'lbs' : 'kg'}
                  <div className="date-picker-goal">
                    {/* Is janky, needs fixing. it re-renders upon clicking date */}
                    <input
                      className="goal-weight"
                      type="number"
                      name="goalWeightLose"
                      placeholder="Goal Weight"
                      min={minLoseWeight}
                      max={weight}
                      step="0.1"
                      value={displayLoseWeightValue || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlurGoalWeight}
                    />
                    {unit === 'imperial' ? 'lbs' : 'kg'}
                    <DatePicker
                      className="date-picker-calendar"
                      selected={goalDate}
                      onChange={(date) => {
                        if (date) {
                          setGoalDate(date)
                          updateWeightFromDate(date)
                          setGoalInfo((prev) => ({
                            ...prev,
                            goalWeight: prev.goalWeight,
                            goalDate: date,
                          }))
                          handleCheckboxChange('lose')
                        }
                      }}
                      onBlur={handleBlurGoalDate}
                    />
                  </div>
                  <input
                    type="range"
                    name="lose"
                    min="0"
                    max={maxRangeLose}
                    step="0.1"
                    className="slider-input"
                    value={goalRateLose}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="lose-placeholder">
                  <p>Up to 1% bodyweight per week</p>
                </div>
              )}
            </label>
            <label>
              <div className="label-container">
                <input
                  type="checkbox"
                  name="gain"
                  checked={checkedGoals.gain}
                  onChange={() => handleCheckboxChange('gain')}
                />
                Gain Muscle
              </div>
              {checkedGoals.gain ? (
                <div className="input-container">
                  <input
                    className="goal-rate"
                    type="number"
                    name="gain"
                    placeholder="lbs per week"
                    value={goalRateGain}
                    onChange={handleInputChange}
                  />
                  {unit === 'imperial' ? 'lbs' : 'kg'}
                  <div className="date-picker-goal">
                    {/* Is janky, needs fixing. it re-renders upon clicking date */}
                    <input
                      className="goal-weight"
                      type="number"
                      name="goalWeightGain"
                      placeholder="Goal Weight"
                      min={weight}
                      max={maxGainWeight}
                      step="0.1"
                      value={displayGainWeightValue || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlurGoalWeight}
                    />
                    {unit === 'imperial' ? 'lbs' : 'kg'}
                    <DatePicker
                      className="date-picker-calendar"
                      selected={goalDate}
                      onChange={(date) => {
                        if (date) {
                          setGoalDate(date)
                          updateWeightFromDate(date)
                          setGoalInfo((prev) => ({
                            ...prev,
                            goalWeight: prev.goalWeight,
                            goalDate: date,
                          }))
                          handleCheckboxChange('gain')
                        }
                      }}
                      onBlur={handleBlurGoalDate}
                    />
                  </div>
                  <input
                    type="range"
                    name="gain"
                    min="0"
                    max={maxRangeGain}
                    step="0.5"
                    className="slider-input"
                    value={goalRateGain}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="gain-placeholder">
                  <p>Up to 2 lbs/1 kg per week</p>
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
                Maintain Weight & Muscle
              </div>
            </label>
          </div>
          <div className="optional">
            <p className="optional-heading">Optional: </p>
            <label>
              <div className="label-container">
                <input
                  type="checkbox"
                  name="bodyFatPercent"
                  checked={checked}
                  onChange={handleCheck}
                />
                Body Fat Percentage:
              </div>
              {checked ? (
                <div className="input-container">
                  <input
                    type="number"
                    // Max could be increased, potentially
                    max={50}
                    name="bodyFatPercent"
                    placeholder="%"
                    value={bodyFatPercent || ''}
                    onChange={handleInputChange}
                  />
                  <input
                    type="range"
                    name="bodyFatPercent"
                    min="0"
                    max="50"
                    step="1"
                    className="slider-input"
                    value={bodyFatPercent}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="bodyFatPercent-placeholder"></div>
              )}
            </label>
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </main>
  )
}


  return
}

export default Measurements
