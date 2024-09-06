import React, { useEffect, useState } from 'react'
import {
  APIError,
  GoalOptionsType,
  SexOptionsType,
  // StatsType,
  UserType,
} from '../types/types'
import { useNavigate } from 'react-router'
import { useMutation } from 'react-query'
import { getUser } from '../types/auth'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// import GoalSlider from '../components/GoalSlider'

// const BASE_URL = 'http://localhost:5000'
const BASE_URL = 'http://192.168.0.241:5000'

async function submitUserInfo(userInfo: UserType) {
  const user = getUser()
  const currStats = { ...user, userInfo }

  console.log('currStats: ', currStats)
  // const response = await fetch(`/api/users/${user.id}`, {
  //   method: 'PUT',
  //   headers: { 'content-type': 'application/json' },
  //   body: JSON.stringify(currStats),
  // })
  const response = await axios.put<UserType>(
    `${BASE_URL}/api/users/${user.id}`,
    currStats
  )

  console.log('response: ', response.data)
  return response.data

  // if (response.ok) {
  //   console.log(currStats)
  //   return response.json()
  // } else {
  //   throw await response.json()
  // }
}

const UserInfo = () => {
  const navigate = useNavigate()
  const user = getUser()
  const [goalWeightLose, setGoalWeightLose] = useState(0)
  const [goalWeightGain, setGoalWeightGain] = useState(0)
  const [goalDate, setGoalDate] = useState(new Date())
  const [unit, setUnit] = useState('imperial')
  const [age, setAge] = useState(0)
  const [sex, setSex] = useState('M')
  const [height, setHeight] = useState(0)
  const [weight, setWeight] = useState(0)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [activityLevelLabel, setActivityLevelLabel] = useState('Sedentary')
  const [checkedGoals, setCheckedGoals] = useState<
    Record<GoalOptionsType, boolean>
  >({
    lose: false,
    gain: false,
    maintain: false,
  })
  const [userInfo, setUserInfo] = React.useState<UserType>({
    fullName: '',
    email: '',
    stats: {
      age: 0,
      sex: 'M',
      heightMetric: 0,
      heightImperial: 0,
      weightMetric: 0,
      weightImperial: 0,
      activityLevel: 1.2,
      activityLevelLabel: 'Sedentary',
    },
  })

  const convertWeightToImperial = (kg: number) => kg / 0.45359237
  const convertWeightToMetric = (lbs: number) => lbs * 0.45359237
  const convertHeightToImperial = (cm: number) => cm * 0.3937007874
  const convertHeightToMetric = (inch: number) => inch / 0.3937007874

  const createUserMutation = useMutation(
    (userInfo: UserType) => submitUserInfo(userInfo),
    {
      onSuccess: function () {
        navigate(`/users/${user.id}`)
      },
      onError: function (error: APIError) {
        setErrorMessage(Object.values(error.errors).join('. '))
      },
    }
  )

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    createUserMutation.mutate(userInfo)
    // console.log('fullName: ', userInfo.fullName)
    // console.log('email: ', userInfo.email)
    // console.log('age: ', userInfo.stats?.age)
    // console.log('sex: ', userInfo.stats?.sex)
    // if (unit === 'metric') {
    //   console.log('height: ', userInfo.stats?.heightMetric)
    //   console.log('weight: ', userInfo.stats?.weightMetric)
    // } else if (unit === 'imperial') {
    //   console.log('height: ', userInfo.stats?.heightImperial)
    //   console.log('weight: ', userInfo.stats?.weightImperial)
    // }
    // console.log(userInfo.stats)
  }

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

    setUserInfo((prevUser) => ({
      ...prevUser,
      goal: {
        ...prevUser.goal,
        goalSelection: goal,
        goalWeight: goalValue,
      },
    }))

    handleInputChange({
      target: {
        name: goal,
        value: goalValue.toString(),
        type: 'number',
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target
    const numericValue = parseFloat(value)

    console.log('value: ', value)

    switch (name) {
      case 'age':
        setAge(numericValue as number)
        setUserInfo((prevUser) => ({
          ...prevUser,
          stats: {
            ...prevUser.stats,
            [name]: numericValue,
          },
        }))
        console.log(userInfo)
        break
      case 'sex':
        setSex(value)
        setUserInfo((prevUser) => ({
          ...prevUser,
          stats: {
            ...prevUser.stats,
            [name]: value as SexOptionsType,
          },
        }))
        console.log(userInfo)
        break
      case 'height':
        if (unit === 'metric') {
          setHeight(numericValue)
          setUserInfo((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              heightMetric: numericValue,
              heightImperial: convertHeightToImperial(numericValue),
            },
          }))
        } else if (unit === 'imperial') {
          setHeight(numericValue)
          setUserInfo((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              heightMetric: convertHeightToMetric(numericValue),
              heightImperial: numericValue,
            },
          }))
        }
        break
      case 'weight':
        if (unit === 'metric') {
          setWeight(numericValue)
          setUserInfo((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              weightMetric: numericValue,
              weightImperial: convertWeightToImperial(numericValue),
            },
          }))
        } else if (unit === 'imperial') {
          setWeight(numericValue)
          setUserInfo((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              weightMetric: convertWeightToMetric(numericValue),
              weightImperial: numericValue,
            },
          }))
        }
        break
      case 'activityLevelLabel':
        setActivityLevelLabel(value)
        switch (value) {
          case 'Sedentary':
            setUserInfo((prevUser) => ({
              ...prevUser,
              stats: {
                ...prevUser.stats,
                activityLevel: 1.2,
                activityLevelLabel: value,
              },
            }))
            break
          case 'Light':
            // setActivityLevel(1.425)
            setUserInfo((prevUser) => ({
              ...prevUser,
              stats: {
                ...prevUser.stats,
                activityLevel: 1.425,
                activityLevelLabel: value,
              },
            }))
            break
          case 'Moderate':
            // setActivityLevel(1.55)
            setActivityLevelLabel('Moderate')
            setUserInfo((prevUser) => ({
              ...prevUser,
              stats: {
                ...prevUser.stats,
                activityLevel: 1.55,
                activityLevelLabel: value,
              },
            }))
            break
          case 'Heavy':
            // setActivityLevel(1.75)
            setActivityLevelLabel('Heavy')
            setUserInfo((prevUser) => ({
              ...prevUser,
              stats: {
                ...prevUser.stats,
                activityLevel: 1.75,
                activityLevelLabel: value,
              },
            }))
            break
          case 'Athlete':
            // setActivityLevel(1.9)
            setActivityLevelLabel('Athlete')
            setUserInfo((prevUser) => ({
              ...prevUser,
              stats: {
                ...prevUser.stats,
                activityLevel: 1.9,
                activityLevelLabel: value,
              },
            }))
            break
          case 'None':
            // setActivityLevel(1)
            setActivityLevelLabel('None')
            setUserInfo((prevUser) => ({
              ...prevUser,
              stats: {
                ...prevUser.stats,
                activityLevel: 1,
                activityLevelLabel: value,
              },
            }))
            break
        }
        break
      case 'lose':
        setGoalWeightLose(numericValue)
        setUserInfo((prevUser) => ({
          ...prevUser,
          goal: {
            ...prevUser.goal,
            goalSelection: name,
            goalRate: numericValue,
          },
        }))
        break
      case 'gain':
        setGoalWeightGain(numericValue)
        setUserInfo((prevUser) => ({
          ...prevUser,
          goal: {
            ...prevUser.goal,
            goalSelection: name,
            goalRate: numericValue,
          },
        }))
        break
      // case 'goalDate':
      //   return (
      //     <div>
      //       <DatePicker
      //         selected={goalDate}
      //         onChange={(goalDate) => setGoalDate(goalDate!)}
      //       />
      //     </div>
      // )
      // break
      default:
        break
    }
  }

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

      setUserInfo((prev) => {
        const newHeightMetric =
          newUnit === 'metric'
            ? prev.stats.heightMetric!
            : convertHeightToMetric(prev.stats.heightImperial!)
        const newHeightImperial =
          newUnit === 'imperial'
            ? prev.stats.heightImperial!
            : convertHeightToImperial(prev.stats.heightMetric!)
        const newWeightMetric =
          newUnit === 'metric'
            ? prev.stats.weightMetric!
            : convertWeightToMetric(prev.stats.weightImperial!)
        const newWeightImperial =
          newUnit === 'imperial'
            ? prev.stats.weightImperial!
            : convertWeightToImperial(prev.stats.weightMetric!)

        setHeight(newUnit === 'metric' ? newHeightMetric : newHeightImperial)
        setWeight(newUnit === 'metric' ? newWeightMetric : newWeightImperial)

        return {
          ...prev,
          stats: {
            ...prev.stats,
            heightMetric: newHeightMetric,
            heightImperial: newHeightImperial,
            weightMetric: newWeightMetric,
            weightImperial: newWeightImperial,
          },
        }
      })
      return newUnit
    })
  }

  useEffect(() => {
    const user = getUser()

    setUserInfo((prevUser) => ({
      ...prevUser,
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    }))
  }, [])

  return (
    <main className="user-page">
      <h1>FitMatrix</h1>
      <div className="user-container">
        <button onClick={toggleUnit}>
          Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
        </button>
        <form onSubmit={handleFormSubmit}>
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

          <p className="form-input">
            <label htmlFor="age">
              <div className="user-stats-heading">Enter Your Details</div>
              <div>Age:</div>
            </label>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={age || ''}
              onChange={handleInputChange}
            />
          </p>
          <p className="form-input">
            <label htmlFor="sex">Sex: </label>
            <select name="sex" value={sex || ''} onChange={handleInputChange}>
              {/* <option value="">Sex</option> */}
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </p>
          <p className="form-input">
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
          </p>
          <p className="form-input">
            <label htmlFor="weight">Weight {}: </label>
            <input
              type="number"
              className="form-control"
              name="weight"
              placeholder="Weight"
              value={displayWeightValue || ''}
              onChange={handleInputChange}
            />
          </p>
          <p className="form-input">
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
          </p>
          <div className="user-user-goals">
            <p className="goal-heading">What goal would you like to achieve?</p>
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
                      onChange={(date) => {
                        if (date !== null) {
                          setGoalDate(date)
                        }
                        setUserInfo((prev) => ({
                          ...prev,
                          goal: {
                            ...prev.goal,
                            goalDate: date!,
                          },
                        }))
                        handleCheckboxChange('lose')
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    name="lose"
                    min="0"
                    max={weight * 0.01 + 0.00000001}
                    step={(weight * 0.01) / 4}
                    className="slider-input"
                    value={goalWeightLose}
                    onChange={(event) => handleInputChange(event)}
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
                        setUserInfo((prev) => ({
                          ...prev,
                          goal: {
                            ...prev.goal,
                            goalDate: date!,
                          },
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
                  {/* <GoalSlider /> */}
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
          <p>
            <input type="submit" value="Submit" />
          </p>
        </form>
      </div>
    </main>
  )
}

export default UserInfo
