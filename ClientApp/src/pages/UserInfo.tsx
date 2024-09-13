import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation } from 'react-query'
import { authHeader } from '../types/auth'

import {
  APIError,
  GoalOptionsType,
  GoalType,
  SexOptionsType,
  StatsType,
} from '../types/types'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'

async function submitStats(entry: StatsType) {
  console.log('stats entry: ', entry)

  const id = entry.userId

  const response = await fetch(`/api/Users/${id}/Stats`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(entry),
  })
  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

async function submitGoal(entry: GoalType) {
  const id = entry.userId

  const response = await fetch(`/api/Users/${id}/Goal`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(entry),
  })

  if (response.ok) {
    console.log(entry)
    return response.json()
  } else {
    throw await response.json()
  }
}

const UserInfo = () => {
  const navigate = useNavigate()
  const { id } = useParams() as { id: string }
  const [errorMessage, setErrorMessage] = React.useState('')
  const [focusedField, setFocusedField] = useState('')

  const [unit, setUnit] = useState('imperial')

  const [age, setAge] = useState(0)
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [month, setMonth] = useState(0)
  const [day, setDay] = useState(0)
  const [year, setYear] = useState(0)

  const [sex, setSex] = useState('U')
  const [height, setHeight] = useState(0)
  const [weight, setWeight] = useState(0)
  const [activityLevel, setActivityLevel] = useState(1.2)
  const [activityLevelLabel, setActivityLevelLabel] = useState('Sedentary')
  const [statsInfo, setStatsInfo] = React.useState<StatsType>({
    userId: 0,
    sex: 'U',
    heightMetric: 0,
    heightImperial: 0,
    weightMetric: 0,
    weightImperial: 0,
    activityLevel: 0,
    activityLevelLabel: 'Sedentary',
  })

  const [goalDate, setGoalDate] = useState(new Date())
  const [goalWeightLose, setGoalWeightLose] = useState(0)
  const [goalWeightGain, setGoalWeightGain] = useState(0)
  const [checkedGoals, setCheckedGoals] = useState<
    Record<GoalOptionsType, boolean>
  >({
    lose: false,
    gain: false,
    maintain: false,
  })
  const [goalInfo, setGoalInfo] = React.useState<GoalType>({
    userId: 0,
    goalSelection: 'maintain',
    goalWeight: 0,
    goalRate: 0,
    goalBfp: 0,
    goalDate: new Date(),
  })

  const convertWeightToImperial = (kg: number) => kg / 0.45359237
  const convertWeightToMetric = (lbs: number) => lbs * 0.45359237
  const convertHeightToImperial = (cm: number) => cm * 0.3937007874
  const convertHeightToMetric = (inch: number) => inch / 0.3937007874
  const maxRange = (weight * 0.01).toFixed(1)

  // Mutations
  ////////////
  // 1
  const createStatsMutation = useMutation(
    (statsInfo: StatsType) => submitStats(statsInfo),
    {
      onSuccess: function () {
        console.log('Stats submitted successfully')
      },
      onError: function (error: APIError) {
        setErrorMessage(Object.values(error.errors).join('. '))
      },
    }
  )
  // 2
  const createGoalMutation = useMutation(
    (goalInfo: GoalType) => submitGoal(goalInfo),
    {
      onSuccess: function () {
        console.log('Goal submitted successfully')
      },
      onError: function (error: APIError) {
        setErrorMessage(Object.values(error.errors).join('. '))
      },
    }
  )

  // Display
  //////////
  const displayHeightValue =
    unit === 'metric'
      ? Math.round(height * 100) / 100
      : Math.round(height * 100) / 100

  const displayWeightValue =
    unit === 'metric'
      ? Math.round(weight * 100) / 100
      : Math.round(weight * 100) / 100

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric'

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

  // Handlers
  ///////////
  const handleCheckboxChange = (goal: GoalOptionsType) => {
    let goalValue = 0

    if (goal === 'lose') {
      goalValue = goalWeightLose
    } else if (goal === 'gain') {
      goalValue = goalWeightGain
    } else {
      goalValue = 0
    }

    setCheckedGoals((prev) => ({
      lose: goal === 'lose' ? !prev.lose : false,
      gain: goal === 'gain' ? !prev.gain : false,
      maintain: goal === 'maintain' ? !prev.maintain : false,
    }))

    setGoalInfo((prevGoal) => ({
      ...prevGoal,
      goalSelection: goal,
      goalWeight: goalValue,
    }))

    handleInputChange({
      target: {
        name: goal,
        value: goalValue.toString(),
        type: 'number',
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const isValidDate = (date: Date) => {
    return date instanceof Date && !isNaN(date.getTime())
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/Users/${id}`, {
          headers: {
            Authorization: authHeader(),
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const user = await response.json()

        if (user) {
          const stats =
            user.stats && user.stats.length > 0
              ? user.stats[user.stats.length - 1]
              : undefined
          const goal =
            user.goal && user.goal.length > 0
              ? user.goal[user.goal.length - 1]
              : undefined

          /// Need to implement correctly
          // Set stats
          if (stats) {
            delete stats.id
            // console.log(stats)
            setStatsInfo({
              ...stats,
              userId: user.id,
            })
            setAge(stats.age || '')
            setSex(stats.sex || '')
            setHeight(stats.heightMetric || '')
            setWeight(stats.weightMetric || '')
            setActivityLevelLabel(stats.activityLevelLabel || '')
          }
          // Set goals
          if (goal) {
            delete goal.id
            setGoalInfo({
              ...goal,
              userId: user.id,
            })

            setCheckedGoals({
              lose: goal.goalSelection === 'lose',
              gain: goal.goalSelection === 'gain',
              maintain: goal.goalSelection === 'maintain',
            })
            setGoalWeightLose(goal.goalWeight!)
            setGoalWeightGain(goal.goalWeight!)
            setGoalDate(goal.goalDate!)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  // USE EFFECT TO SPEED UP TESTING
  useEffect(() => {
    setStatsInfo((prev) => ({
      ...prev,
      age: age,
      sex: prev.sex,
      weightImperial: weight,
      weightMetric: convertWeightToMetric(weight),
      heightImperial: height,
      heightMetric: convertHeightToMetric(height),
      activityLevel: activityLevel,
      activityLevelLabel: prev.activityLevelLabel,
    }))
    setGoalInfo((prev) => ({
      ...prev,
      goalSelection: prev.goalSelection,
      goalWeight: prev.goalWeight,
      goalRate: prev.goalRate,
      goalBfp: prev.goalBfp,
      goalDate: prev.goalDate,
    }))
  }, [])

  // Handle Inputs
  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target
    const numericValue = parseFloat(value)

    switch (name) {
      case 'age':
        setAge(numericValue as number)
        setStatsInfo((prevStats) => ({
          ...prevStats,
          [name]: numericValue,
        }))
        updateDateFromAge(numericValue)
        break
      case 'month':
        setMonth(numericValue)
        break
      case 'day':
        setDay(numericValue)
        break
      case 'year':
        setYear(numericValue)
        break
      case 'sex':
        setSex(value)
        setStatsInfo((prevStats) => ({
          ...prevStats,
          [name]: value as SexOptionsType,
        }))
        console.log(goalInfo)
        break
      case 'height':
        if (unit === 'metric') {
          setHeight(numericValue)
          setStatsInfo((prevStats) => ({
            ...prevStats,
            heightMetric: numericValue,
            heightImperial: convertHeightToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setHeight(numericValue)
          setStatsInfo((prevStats) => ({
            ...prevStats,
            heightMetric: convertHeightToMetric(numericValue),
            heightImperial: numericValue,
          }))
        }
        break
      case 'weight':
        if (unit === 'metric') {
          setWeight(numericValue)
          setStatsInfo((prevStats) => ({
            ...prevStats,
            weightMetric: numericValue,
            weightImperial: convertWeightToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setWeight(numericValue)
          setStatsInfo((prevStats) => ({
            ...prevStats,
            weightMetric: convertWeightToMetric(numericValue),
            weightImperial: numericValue,
          }))
        }
        break
      case 'activityLevelLabel':
        switch (value) {
          case 'Sedentary':
            setActivityLevelLabel(value)
            setActivityLevel(1.2)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.2,
              activityLevelLabel: value,
            }))
            break
          case 'Light':
            setActivityLevelLabel(value)
            setActivityLevel(1.425)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.425,
              activityLevelLabel: value,
            }))
            break
          case 'Moderate':
            setActivityLevelLabel(value)
            setActivityLevel(1.55)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.55,
              activityLevelLabel: value,
            }))
            break
          case 'Heavy':
            setActivityLevelLabel(value)
            setActivityLevel(1.75)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.75,
              activityLevelLabel: value,
            }))
            break
          case 'Athlete':
            setActivityLevelLabel(value)
            setActivityLevel(1.9)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.9,
              activityLevelLabel: value,
            }))
            break
          case 'None':
            setActivityLevelLabel(value)
            setActivityLevel(1)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1,
              activityLevelLabel: value,
            }))
            break
        }
        break
      case 'lose':
        setGoalWeightLose(numericValue)
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalSelection: name,
          goalRate: numericValue,
        }))
        break
      case 'gain':
        setGoalWeightGain(numericValue)
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalSelection: name,
          goalRate: numericValue,
        }))
        break
      default:
        break
    }
  }

  // Form Submit
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log('statsInfo in submit: ', statsInfo)
    updateDateFromAge(age)
    // setStatsInfo((prev) => ({
    //   ...prev,
    //   doB: dob,
    // }))
    try {
      await Promise.all([
        (statsInfo.userId = Number(id)),
        (goalInfo.userId = Number(id)),
        createStatsMutation.mutate(statsInfo),
        createGoalMutation.mutate(goalInfo),
      ])

      navigate(`/users/${id}`)
    } catch (error) {
      console.error('Error submitting both stats and goal:', error)
    }
  }

  // const calculateAge = () => {
  //   if (year.toString().length === 4) {
  //     console.log('date at beginning: ', dateOfBirth)
  //   }

  //   // handle date field
  //   // Needs to be written

  //   // Handle age input only
  //   if (age && isFocused) {
  //     const today = new Date()
  //     const userDob = new Date(
  //       today.getFullYear() - age,
  //       today.getMonth(),
  //       today.getDate()
  //     )

  //     setDateOfBirth(userDob)
  //     setStatsInfo((prev) => ({
  //       ...prev,
  //       doB: userDob,
  //     }))
  //     // setIsFocused(false)
  //     // Handle month day year
  //   } else if (
  //     month !== 0 &&
  //     day !== 0 &&
  //     year !== 0 &&
  //     year.toString().length === 4
  //   ) {
  //     const monthInt = month - 1
  //     const dayInt = day
  //     const yearInt = year

  //     if (
  //       monthInt >= 0 &&
  //       monthInt < 12 &&
  //       dayInt > 0 &&
  //       dayInt <= 31 &&
  //       yearInt > 0
  //     ) {
  //       // Validate day based on month and year (leap year handling is not included)
  //       if (monthInt === 1 && dayInt > 29) {
  //         // alert('February cannot have more than 29 days.')
  //         return
  //       }
  //       if ([3, 5, 8, 10].includes(monthInt) && dayInt > 30) {
  //         // alert('This month cannot have more than 30 days.')
  //         return
  //       }

  //       const today = new Date()
  //       const userDob = new Date(yearInt, monthInt, dayInt)

  //       if (userDob.getDate() === dayInt && userDob.getMonth() === monthInt) {
  //         setDateOfBirth(userDob)
  //         const todayYear = today.getFullYear()
  //         const newDateYear = userDob.getFullYear()
  //         console.log(todayYear, newDateYear)
  //         const tempAge = todayYear - newDateYear

  //         console.log(today.getFullYear())
  //         console.log(userDob.getFullYear())
  //         console.log('age: ', tempAge)
  //         // console.log('newDate: ', userDob)
  //         // console.log('today: ', dateOfBirth)

  //         setAge(tempAge)
  //         setDateOfBirth(userDob)
  //         setStatsInfo((prev) => ({
  //           ...prev,
  //           age: tempAge,
  //           doB: userDob,
  //         }))
  //         // alert(`Date is set to: ${newDate.toDateString()}`)
  //       } else {
  //         alert('Invalid date')
  //       }
  //     } else {
  //       alert('Invalid input')
  //     }
  //   }
  // }

  const calculateAge = (dob: Date): number => {
    const today = new Date()
    if (isValidDate(today) && isValidDate(dob)) {
      let age = today.getFullYear() - dob.getFullYear()
      const monthDifference = today.getMonth() - dob.getMonth()
      const dayDifference = today.getDate() - dob.getDate()

      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--
      }

      return age
    }
    return 0
  }

  const updateDateFromAge = (age: number) => {
    const today = new Date()
    const userDob = new Date(
      today.getFullYear() - age,
      today.getMonth(),
      today.getDate()
    )
    console.log('today: ', today)
    console.log('userDob: ', userDob)
    if (isValidDate(userDob)) {
      setDateOfBirth(userDob)
      //     setStatsInfo((prev) => ({
      //       ...prev,
      //       doB: userDob,
      //     }))
      setStatsInfo((prev) => ({ ...prev, doB: userDob }))

      setMonth(userDob.getMonth() + 1)
      setDay(userDob.getDate())
      setYear(userDob.getFullYear())
    }
  }

  const updateAgeFromDate = (dob: Date) => {
    const today = new Date()

    if (isValidDate(today)) {
      const age = today.getFullYear() - dob.getFullYear()
      setAge(age)
    }
  }

  // Handlers to update focus state

  const handleFocus = (field: string) => {
    setFocusedField(field)
  }

  function handleBlur() {
    if (month && day && year && year.toString().length === 4) {
      const dob = new Date(year, month - 1, day)

      if (isValidDate(dob)) {
        setDateOfBirth(dob)
        setAge(calculateAge(dob))
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !document.querySelector('.form-input')!.contains(event.target as Node)
      ) {
        setFocusedField('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <main className="user-page">
      <h1>FitMatrix</h1>
      <div className="user-container">
        <button onClick={toggleUnit}>
          Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
        </button>
        <form onSubmit={handleFormSubmit}>
          {errorMessage ? (
            <div className="form-error">{errorMessage}</div>
          ) : null}
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
              onBlur={handleBlur}
            />
            {focusedField !== '' && (
              <>
                <div className="date-picker-age">
                  {/* <Calendar
                    captionLayout="dropdown"
                    fromYear={1920}
                    toYear={2020}
                  /> */}
                  <DatePicker
                    selected={dateOfBirth}
                    onChange={(date) => {
                      if (date) {
                        setDateOfBirth(date)
                        updateAgeFromDate(date)
                        setStatsInfo((prev) => ({
                          ...prev,
                          doB: date,
                          sex: 'F',
                        }))
                      }
                    }}
                    onFocus={() => handleFocus('dob')}
                    onBlur={handleBlur}
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
                      onBlur={handleBlur}
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
                      onBlur={handleBlur}
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
                      onBlur={handleBlur}
                    />
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="form-input">
            <label htmlFor="sex">Sex: </label>
            <select name="sex" value={sex || ''} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>
          <div className="form-input">
            <label htmlFor="height">Height: </label>
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
            <label htmlFor="weight">Weight {}: </label>
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
            >
              <option value="None">None</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Light">Light</option>
              <option value="Moderate">Moderate</option>
              <option value="Heavy">Heavy</option>
              <option value="Athlete">Athlete</option>
            </select>
          </div>
          <div className="user-user-goals">
            <div className="goal-heading">
              What goal would you like to achieve?
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
                    type="number"
                    name="lose"
                    placeholder="lbs"
                    value={goalWeightLose}
                    onChange={handleInputChange}
                  />
                  <div className="date-picker">
                    {/* Is janky, needs fixing. it re-renders upon clicking date */}
                    <DatePicker
                      selected={goalDate}
                      className="date-picker-goal"
                      onChange={(date) => {
                        if (date !== null) {
                          setGoalDate(date)
                        }
                        setGoalInfo((prev) => ({
                          ...prev,
                          goalDate: date!,
                        }))
                        handleCheckboxChange('lose')
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    name="lose"
                    min="0"
                    max={maxRange}
                    step="0.1"
                    className="slider-input"
                    value={goalWeightLose}
                    onChange={(event) => handleInputChange(event)}
                  />
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
                  name="gain"
                  checked={checkedGoals.gain}
                  onChange={() => handleCheckboxChange('gain')}
                />
                Gain Muscle
              </div>
              {checkedGoals.gain ? (
                <div className="input-container">
                  <input
                    type="number"
                    name="gain"
                    placeholder="lbs"
                    value={goalWeightGain}
                    onChange={handleInputChange}
                  />
                  <div className="date-picker">
                    <DatePicker
                      selected={goalDate}
                      onChange={(date) => {
                        if (date !== null) {
                          setGoalDate(date)
                        }
                        setGoalInfo((prev) => ({
                          ...prev,
                          goalDate: date!,
                        }))
                        handleCheckboxChange('lose')
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    name="gain"
                    min="0"
                    max="2"
                    step="0.5"
                    className="slider-input"
                    value={goalWeightGain}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="gain-placeholder">
                  <p>
                    Up to 2lbs/1kg per week
                    {/* Up to 1% of bodyweight per week
                    10%-20% (20% MAX) above maintenance calories. 
                    0.5lb - 1lb / week
                    POST CUT - 0.5% for 2 months after */}
                  </p>
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
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </main>
  )
}

export default UserInfo
