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
import { differenceInCalendarISOWeekYears, differenceInDays } from 'date-fns'
import { HardDriveDownload } from 'lucide-react'

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
  const [checked, setChecked] = useState(false)

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
  const [activityLevelLabel, setActivityLevelLabel] = useState('')
  const [bodyFatPercent, setBodyFatPercent] = useState(0)

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

  const [goalRate, setGoalRate] = useState(0)
  const [goalRateLose, setGoalRateLose] = useState(0)
  const [goalRateGain, setGoalRateGain] = useState(0)
  const [bmi, setBmi] = useState(0)
  const [goalWeight, setGoalWeight] = useState(0)
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
  })

  const maxRange = (weight * 0.01).toFixed(1)
  const convertWeightToImperial = (kg: number) => kg / 0.45359237
  const convertWeightToMetric = (lbs: number) => lbs * 0.45359237
  const convertHeightToImperial = (cm: number) => cm * 0.3937007874
  const convertHeightToMetric = (inch: number) => inch / 0.3937007874

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

  // Handlers
  ///////////
  const handleCheckboxChange = (goal: GoalOptionsType) => {
    let goalValue = 0

    if (goal === 'lose') {
      goalValue = goalRateLose
    } else if (goal === 'gain') {
      goalValue = goalRateGain
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
      goalRate: goalValue,
      // goalWeight: goalValue,
    }))

    handleInputChange({
      target: {
        name: goal,
        value: goalValue.toString(),
        type: 'number',
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  // Makes sure generated Age dates are valid
  const isValidDate = (date: Date) => {
    return date instanceof Date && !isNaN(date.getTime())
  }

  // Get user and load data if data is in db
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
            setDateOfBirth(stats.doB)
            if (stats.doB) {
              const dob = new Date(stats.doB)
              setMonth(dob.getMonth() + 1)
              setDay(dob.getDate())
              setYear(dob.getFullYear())
            }

            setSex(stats.sex || '')
            setHeight(stats.heightImperial || '')
            setWeight(stats.weightImperial || '')
            setActivityLevelLabel(stats.activityLevelLabel || '')
            setBodyFatPercent(stats.bodyFatPercent || '')
            if (stats.bodyFatPercent !== 0) {
              setChecked(true)
            }
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
            setGoalRateLose(goal.goalWeight!)
            setGoalRateGain(goal.goalWeight!)
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
    console.log(name)
    switch (name) {
      case 'age':
        setAge(numericValue as number)
        setStatsInfo((prevStats) => ({
          ...prevStats,
          [name]: numericValue,
        }))
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

      case 'bodyFatPercent':
        setBodyFatPercent(numericValue)
        setStatsInfo((prevStats) => ({
          ...prevStats,
          [name]: numericValue,
        }))
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
        // Rate
        setGoalRateLose(numericValue)
        setGoalRate(numericValue)
        // Weight
        setGoalWeight(calculateGoalWeight(numericValue))

        // User
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalSelection: name,
          goalRate: numericValue,
        }))
        break

      case 'gain':
        setGoalRateGain(numericValue)
        setGoalRate(numericValue)
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalSelection: name,
          goalRate: numericValue,
        }))
        break
      case 'goalRateLose':
        setGoalRateLose(numericValue)
        setGoalRate(numericValue)
        break
      case 'goalRateGain':
        setGoalRateGain(numericValue)
        setGoalRate(numericValue)
        break
      case 'goalWeight':
        setGoalWeight(numericValue)
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
    // updateDateFromGoalRate

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

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const calculateGoalWeight = (goalRate: number): number => {
    if (goalDate) {
      const timeToGoal = calculateGoalRate(goalDate)
      const rate = goalRate
      const weight = timeToGoal / rate
      setGoalWeight(weight)
      return goalWeight
    }
    return 0
  }

  const calculateDifferenceInDays = (): number => {
    const today = new Date()
    const differenceInTime = goalDate.getTime() - today.getTime()
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))
    return differenceInDays
  }

  const calculateGoalRate = (goalDate: Date): number => {
    const today = new Date()
    if (isValidDate(today) && isValidDate(goalDate)) {
      // const differenceInTime = goalDate.getTime() - today.getTime()

      if (goalDate < today) {
        throw new Error('The provided date must be in the future.')
      } else {
        // const differenceInDays = Math.ceil(
        // differenceInTime / (1000 * 3600 * 24)
        // )
        const differenceInDays = calculateDifferenceInDays()
        const differenceInWeeks = differenceInDays / 7
        const goalRate =
          goalInfo.goalSelection === 'lose' ? goalRateLose : goalRateGain

        setGoalRate(goalRate)

        return differenceInWeeks
      }
    }

    return 0
  }

  const updateWeightFromDate = (goalDate: Date) => {
    const today = new Date()
    console.log('here')
    if (isValidDate(today)) {
      const differenceInDays = calculateGoalRate(goalDate)
      // returns 15 days

      console.log('goalRate: ', goalRate)
      const totalAmount = goalRate * differenceInDays
      console.log(totalAmount)
    } else {
      console.log('not valid')
    }
  }

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

    if (isValidDate(userDob)) {
      setDateOfBirth(userDob)
      setStatsInfo((prev) => ({
        ...prev,
        doB: userDob,
      }))

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

  function handleBlurDob() {
    if (month && day && year && year.toString().length === 4) {
      const dob = new Date(year, month - 1, day)

      if (isValidDate(dob)) {
        setDateOfBirth(dob)
        setAge(calculateAge(dob))
        setStatsInfo((prev) => ({
          ...prev,
          doB: dob,
        }))
      }
    }
  }

  function handleBlurGoalDate() {
    if (month && day && year && year.toString().length === 4) {
      const goalDate = new Date(year, month - 1, day)

      if (isValidDate(goalDate)) {
        setGoalDate(goalDate)
        setGoalRate(goalRate)
        setGoalWeight(calculateGoalRate(goalDate))
        setStatsInfo((prev) => ({
          ...prev,
          goalWeight: goalWeight,
          goalRate: goalRate,
          goalDate: goalDate,
        }))
      }
    }
  }

  // const calculateGoalRate = (): number => {
  //   if (goalDate && goalWeight > 0) {
  //     const today = new Date();
  //     const differenceInDays = Math.ceil(
  //       (goalDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  //     );

  //     if (differenceInDays <= 0) {
  //       throw new Error('The goal date must be in the future.');
  //     }

  //     return goalWeight / differenceInDays;
  //   }

  //   return goalRate;
  // };

  const validateGoalWeight = (weight: number) => {
    // const bmi = weight! / Math.pow(heightMetric! / 100, 2)
    // setBmi(bmi)
    // if (bmi )
    if (weight <= 0 || weight > weight * 0.75) {
      throw new Error(`Goal weight must be between 1 and ${weight * 0.75} lbs.`)
    }
    setGoalWeight(weight)
  }

  // Handle mouse clicks outside Age, Month, Day, Year, DoB date
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
              onBlur={handleBlurDob}
            />
            {focusedField !== '' && (
              <>
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
            >
              <option value="None">None</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Light">Light</option>
              <option value="Moderate">Moderate</option>
              <option value="Heavy">Heavy</option>
              <option value="Athlete">Athlete</option>
            </select>
          </div>
          <div className="user-goals">
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
                    className="goal-rate"
                    type="number"
                    // name="goalRateLose"
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
                      name="goalWeight"
                      placeholder="Goal Weight"
                      value={goalWeight || ''}
                      onChange={handleInputChange}
                    />
                    <DatePicker
                      selected={goalDate}
                      onChange={(date) => {
                        // onChange={(date) => {
                        //   if (date) {
                        //     setDateOfBirth(date)
                        //     updateAgeFromDate(date)
                        //     setMonth(date.getMonth() + 1)
                        //     setDay(date.getDate())
                        //     setYear(date.getFullYear())
                        //     setStatsInfo((prev) => ({
                        //       ...prev,
                        //       doB: date,
                        //     }))
                        //   }
                        // }
                        if (date) {
                          setGoalDate(date)
                          updateWeightFromDate(date)
                          setGoalInfo((prev) => ({
                            ...prev,
                            goalDate: date!,
                          }))
                          handleCheckboxChange('lose')
                        }
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
                    value={goalRateLose}
                    onChange={handleInputChange}
                    onBlur={handleBlurGoalDate}
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
                    name="goalWeightGain"
                    placeholder="lbs"
                    value={goalRateGain}
                    onChange={handleInputChange}
                  />
                  <div className="date-picker-goal">
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
                    value={goalRateGain}
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

export default UserInfo
