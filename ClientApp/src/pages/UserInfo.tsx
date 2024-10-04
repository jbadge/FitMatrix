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
    return response.json()
  } else {
    throw await response.json()
  }
}

type InteractionType = 'weight' | 'rate' | 'date' | null

interface InteractionData {
  goalDate: Date | null
  goalRate: number | null
  goalWeight: number | null
  lastInteraction: InteractionType
  previousInteraction: InteractionType
}

const interactionData: InteractionData = {
  goalDate: null,
  goalRate: null,
  goalWeight: null,
  lastInteraction: null,
  previousInteraction: null,
}

const UserInfo = () => {
  const navigate = useNavigate()
  const { id } = useParams() as { id: string }
  const [errorMessage, setErrorMessage] = React.useState('')
  const [focusedField, setFocusedField] = useState('')
  const [lastFocusedInput, setLastFocusedInput] = useState('')
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
  const [activityLevelLabel, setActivityLevelLabel] = useState('')
  const [bodyFatPercent, setBodyFatPercent] = useState(0)

  const [checkedGoals, setCheckedGoals] = useState<
    Record<GoalOptionsType, boolean>
  >({
    lose: false,
    gain: false,
    maintain: false,
  })

  const [goalDate, setGoalDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  )

  const [goalWeight, setGoalWeight] = useState(0)
  const [goalRate, setGoalRate] = useState(0)
  const [goalWeightLoseImperial, setGoalWeightLoseImperial] = useState(0)
  const [goalRateLoseImperial, setGoalRateLoseImperial] = useState(0)
  const [goalWeightGainImperial, setGoalWeightGainImperial] = useState(0)
  const [goalRateGainImperial, setGoalRateGainImperial] = useState(0)
  const [goalWeightLoseMetric, setGoalWeightLoseMetric] = useState(0)
  const [goalRateLoseMetric, setGoalRateLoseMetric] = useState(0)
  const [goalWeightGainMetric, setGoalWeightGainMetric] = useState(0)
  const [goalRateGainMetric, setGoalRateGainMetric] = useState(0)
  const [bmi, setBmi] = useState(0)

  const [statsInfo, setStatsInfo] = React.useState<StatsType>({
    age: 0,
    userId: 0,
    sex: 'U',
    heightImperial: 0,
    weightImperial: 0,
    heightMetric: 0,
    weightMetric: 0,
    activityLevel: 0,
    activityLevelLabel: 'Sedentary',
  })

  const [goalInfo, setGoalInfo] = React.useState<GoalType>({
    userId: 0,
    goalSelection: 'maintain',
    goalWeightLoseImperial: 0,
    goalRateLoseImperial: 0,
    goalWeightGainImperial: 0,
    goalRateGainImperial: 0,
    goalWeightLoseMetric: 0,
    goalRateLoseMetric: 0,
    goalWeightGainMetric: 0,
    goalRateGainMetric: 0,
    goalBfp: 0,
    // goalDate: new Date(),
  })

  const maxRangeLose = Math.round(weight * 0.01 * 2) / 2
  const maxRangeGain = unit === 'imperial' ? 2 : 0.91
  const effectiveLoss = Number(
    (
      maxRangeLose *
      (calculateDaysBetweenTodayAndGoalDate(goalDate!) / 7)
    ).toFixed(1)
  )

  const effectiveGain = Number(
    (
      maxRangeGain *
      (calculateDaysBetweenTodayAndGoalDate(goalDate!) / 7)
    ).toFixed(1)
  )

  const minLoseWeight =
    goalRate !== 0 ? Number((weight - effectiveLoss).toFixed(1)) : 0
  const maxGainWeight = Number((weight + effectiveGain).toFixed(1))

  const convertWeightToImperial = (kg: number) => kg / 0.45359237
  const convertWeightToMetric = (lbs: number) => lbs * 0.45359237
  const convertHeightToImperial = (cm: number) => cm * 0.3937007874
  const convertHeightToMetric = (inch: number) => inch / 0.3937007874

  //////////
  // Display
  //////////
  const displayHeightValue = Math.round(height * 100) / 100

  const displayWeightValue = Math.round(weight * 10) / 10

  const displayGoalWeightValue =
    unit === 'imperial'
      ? lastFocusedInput === 'lose' ||
        lastFocusedInput === 'goalWeightLose' ||
        goalInfo.goalSelection === 'lose'
        ? goalWeightLoseImperial
        : goalWeightGainImperial
      : lastFocusedInput === 'lose' ||
          lastFocusedInput === 'goalWeightLose' ||
          goalInfo.goalSelection === 'lose'
        ? goalWeightLoseMetric
        : goalWeightGainMetric

  // Maybe we do it this way instead of above methods
  const displayGoalRate =
    unit === 'imperial'
      ? lastFocusedInput === 'lose' ||
        lastFocusedInput === 'goalWeightLose' ||
        goalInfo.goalSelection === 'lose'
        ? goalRateLoseImperial
        : goalRateGainImperial
      : lastFocusedInput === 'lose' ||
          lastFocusedInput === 'goalWeightLose' ||
          goalInfo.goalSelection === 'lose'
        ? goalRateLoseMetric
        : goalRateGainMetric

  // Listeners
  // const weightInput = document.getElementById(
  //   'lose-weight-input'
  // ) as HTMLInputElement
  // weightInput?.addEventListener('blur', () => {
  //   if (interactionData.previousInteraction !== null) {
  //     console.log('FOCUSSSSSS HEREEEEEEEEE')
  //     // weightInput.reportValidity()
  //   }
  //   if (interactionData.previousInteraction === null) {
  //     weightInput.reportValidity()
  //     console.log('BLURRRRRRRRRRRR')
  //     console.log(weightInput.validity)
  //   }
  // })
  // weightInput?.addEventListener('focus', () => {
  //   weightInput.reportValidity()
  //   console.log('FOCUSSSSSSSSSSS')
  // })

  // const dateInput = document.getElementById('date-input') as HTMLInputElement
  // dateInput?.addEventListener('focus', () => {
  //   dateInput.reportValidity()
  // })

  /////////
  // Toggle
  /////////
  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'imperial' ? 'metric' : 'imperial'

      // setGoalInfo((prev) => {
      //   const newGoalWeightLoseImperial =
      //     newUnit === 'imperial'
      //       ? prev.goalWeightGainImperial!
      //       : convertWeightToImperial(prev.goalWeightGainMetric!)

      //   const newGoalWeightLoseMetric =
      //     newUnit === 'imperial'
      //       ? convertWeightToMetric(prev.goalWeightGainImperial!)
      //       : prev.goalWeightGainMetric!

      //   const newGoalWeightGainImperial =
      //     newUnit === 'imperial'
      //       ? prev.goalWeightGainImperial!
      //       : convertWeightToImperial(prev.goalWeightGainMetric!)

      //   const newGoalWeightGainMetric =
      //     newUnit === 'imperial'
      //       ? convertWeightToMetric(prev.goalWeightGainImperial!)
      //       : prev.goalWeightGainMetric!

      //   const newGoalRateLoseImperial =
      //     newUnit === 'imperial'
      //       ? prev.goalRateLoseImperial!
      //       : convertWeightToImperial(prev.goalRateLoseImperial!)

      //   const newGoalRateLoseMetric =
      //     newUnit === 'imperial'
      //       ? convertWeightToMetric(prev.goalRateLoseMetric!)
      //       : prev.goalRateLoseMetric!

      //   const newGoalRateGainImperial =
      //     newUnit === 'imperial'
      //       ? prev.goalRateGainImperial!
      //       : convertWeightToImperial(prev.goalRateGainImperial!)

      //   const newGoalRateGainMetric =
      //     newUnit === 'imperial'
      //       ? convertWeightToMetric(prev.goalRateGainMetric!)
      //       : prev.goalRateGainMetric!

      //   console.log(
      //     'New Goal Weight Lose (Imperial):',
      //     newGoalWeightLoseImperial
      //   )
      //   console.log('New Goal Weight Lose (Metric):', newGoalWeightLoseMetric)
      //   console.log(
      //     'New Goal Weight Gain (Imperial):',
      //     newGoalWeightGainImperial
      //   )
      //   console.log('New Goal Weight Gain (Metric):', newGoalWeightGainMetric)
      //   console.log('New Goal Rate Lose (Imperial):', newGoalRateLoseImperial)
      //   console.log('New Goal Rate Lose (Metric):', newGoalRateLoseMetric)
      //   console.log('New Goal Rate Gain (Imperial):', newGoalRateGainImperial)
      //   console.log('New Goal Rate Gain (Metric):', newGoalRateGainMetric)

      setGoalRate(
        Number(
          (newUnit === 'imperial'
            ? goalInfo.goalSelection === 'lose'
              ? goalInfo.goalRateLoseImperial!
              : goalInfo.goalRateGainImperial!
            : goalInfo.goalSelection === 'lose'
              ? goalInfo.goalRateLoseMetric!
              : goalInfo.goalRateGainMetric!
          ).toFixed(1)
        )
      )
      if (newUnit === 'imperial') {
        if (goalInfo.goalSelection === 'lose') {
          setGoalRate(goalRate)
        } else if (goalInfo.goalSelection === 'gain') {
          //
        }
      } else if (newUnit === 'metric') {
        if (goalInfo.goalSelection === 'lose') {
          //
        } else if (goalInfo.goalSelection === 'gain') {
          //
        }
      }

      //   setGoalWeight(
      //     newUnit === 'metric' ? newGoalWeightMetric : newGoalWeightImperial
      //   )
      // return {
      //   ...prev,
      //   goalWeightLoseImperial: newGoalWeightLoseImperial,
      //   goalRateLoseImperial: newGoalRateLoseImperial,
      //   goalWeightGainImperial: newGoalWeightGainImperial,
      //   goalRateGainImperial: newGoalRateGainImperial,
      //   goalWeightLoseMetric: newGoalWeightLoseMetric,
      //   goalRateLoseMetric: newGoalRateLoseMetric,
      //   goalWeightGainMetric: newGoalWeightGainMetric,
      //   goalRateGainMetric: newGoalRateGainMetric,
      //   // newUnit === 'metric' ? newGoalWeightMetric : newGoalWeightImperial,
      // }
      // })

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

  ////////////
  // Mutations
  ////////////
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

  //////////////
  // Validations
  //////////////

  // Makes sure dates are valid
  function isValidDate(date: Date) {
    console.log('isValidDate')
    console.log('isValidDate: ', interactionData)
    return date instanceof Date && !isNaN(date.getTime())
  }

  // Make sure weights are valid
  const isValidWeight = (): boolean => {
    console.log('isValidWeight')
    if (statsInfo.heightMetric) {
      if (goalInfo.goalSelection === 'lose') {
        const tempBmi =
          goalWeightLoseMetric / Math.pow(statsInfo.heightMetric / 100, 2)
        setBmi(tempBmi)

        if (tempBmi < 18.5) {
          // MAY NOT NEED STATE VARIABLE HERE...
          console.log(tempBmi)
          console.log(bmi)
          const minimumAllowedWeight =
            18.5 * Math.pow(statsInfo.heightMetric / 100, 2)

          // Needs an error message to pop up and tell them that would be unhealthy
          unit === 'imperial'
            ? setGoalWeightLoseImperial(
                Number(convertWeightToImperial(minimumAllowedWeight).toFixed(1))
              )
            : // ,
              // setGoalWeight(
              //   Number(convertWeightToImperial(minimumAllowedWeight).toFixed(1))
              // )
              setGoalWeightLoseMetric(
                convertWeightToMetric(Number(minimumAllowedWeight.toFixed(1)))
              )
          //, setGoalWeight(Number(minimumAllowedWeight.toFixed(1)))
        }
        return false
      } else if (goalWeight > weight) {
        // setGoalWeight(Number(weight.toFixed(1)))
        setGoalWeightGainImperial(Number(weight.toFixed(1)))
        setGoalWeightGainMetric(Number(weight.toFixed(1)))
        return false
      }
    } else {
      return true
    }
    return true
  }

  ///////////
  // Handlers
  ///////////
  const handleCheckboxChange = (goal: GoalOptionsType) => {
    console.log('handleCheckboxChange')

    let tempGoalRate = 0
    if (goal === 'lose') {
      tempGoalRate =
        unit === 'imperial' ? goalRateLoseImperial : goalRateLoseMetric
    } else if (goal === 'gain') {
      tempGoalRate =
        unit === 'imperial' ? goalRateGainImperial : goalRateGainMetric
    } else {
      tempGoalRate = 0
    }

    if (
      (goalWeightLoseImperial === 0 && goalRateLoseImperial === 0) ||
      (goalWeightGainImperial === 0 && goalRateGainImperial === 0)
    ) {
      if (unit === 'imperial') {
        if (goal === 'lose') {
          setGoalWeight(weight)
          setGoalWeightLoseImperial(weight)
          setGoalWeightLoseMetric(convertWeightToMetric(weight))
        }
        if (goal === 'gain') {
          setGoalWeight(weight)
          setGoalWeightGainImperial(weight)
          setGoalWeightGainMetric(convertWeightToMetric(weight))
        }
      }
    }

    // unit === 'imperial'
    // ? goal.goalSelection === 'lose'
    //   ? (setGoalRate(goal.goalRateLoseImperial),
    //     setGoalWeight(goal.goalWeightLoseImperial))
    //   : (setGoalRate(goal.goalRateGainImperial),
    //     setGoalWeight(goal.goalWeightGainImperial))
    // : goal.goalSelection === 'lose'
    //   ? (setGoalRate(goal.goalRateLoseMetric),
    //     setGoalWeight(goal.goalWeightLoseMetric))
    //   : (setGoalRate(goal.goalRateGainMetric),
    //     setGoalWeight(goal.goalWeightGainMetric))

    setCheckedGoals((prev) => ({
      lose: goal === 'lose' ? !prev.lose : false,
      gain: goal === 'gain' ? !prev.gain : false,
      maintain: goal === 'maintain' ? !prev.maintain : false,
    }))

    setGoalInfo((prevGoal) => ({
      ...prevGoal,
      goalSelection: goal,
      goalRate: tempGoalRate,
    }))

    handleInputChange({
      target: {
        name: goal,
        value: tempGoalRate.toString(),
        type: 'number',
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    console.log('handleInputChange')

    const { name, value } = event.target
    const numericValue = parseFloat(value)
    console.log('name: ', name)
    console.log('value: ', value)
    console.log('numeric value: ', numericValue)

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
        if (unit === 'imperial') {
          setWeight(numericValue)
          setStatsInfo((prevStats) => ({
            ...prevStats,
            weightMetric: convertWeightToMetric(numericValue),
            weightImperial: numericValue,
          }))
        } else if (unit === 'metric') {
          setWeight(numericValue)
          setStatsInfo((prevStats) => ({
            ...prevStats,
            weightMetric: numericValue,
            weightImperial: convertWeightToImperial(numericValue),
          }))
        }
        break

      case 'bodyFatPercent':
        setBodyFatPercent(numericValue)
        setStatsInfo((prevStats) => ({
          ...prevStats,
          [name]: numericValue,
        }))
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalBodyFatPercent: numericValue,
        }))
        break

      case 'activityLevelLabel':
        switch (value) {
          case 'Sedentary':
            setActivityLevelLabel(value)
            // setActivityLevel(1.2)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.2,
              activityLevelLabel: value,
            }))
            break

          case 'Light':
            setActivityLevelLabel(value)
            // setActivityLevel(1.425)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.425,
              activityLevelLabel: value,
            }))
            break

          case 'Moderate':
            setActivityLevelLabel(value)
            // setActivityLevel(1.55)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.55,
              activityLevelLabel: value,
            }))
            break

          case 'Heavy':
            setActivityLevelLabel(value)
            // setActivityLevel(1.75)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.75,
              activityLevelLabel: value,
            }))
            break

          case 'Athlete':
            setActivityLevelLabel(value)
            // setActivityLevel(1.9)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.9,
              activityLevelLabel: value,
            }))
            break

          case 'None':
            setActivityLevelLabel(value)
            // setActivityLevel(1)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1,
              activityLevelLabel: value,
            }))
            break
        }
        break

      case 'lose':
        // updateGoalInteractions(undefined, goalRate)
        // console.log('goalRate: ', goalRate)
        if (unit === 'imperial') {
          // Set Imperial Measurements
          setGoalRateLoseImperial(numericValue)
          // console.log(convertWeightToMetric(numericValue))
          setGoalRateLoseMetric(convertWeightToMetric(numericValue))
          // set goalInfo for lose and gain
        } else if (unit === 'metric') {
          // Set Metric Measurements
          setGoalRateLoseImperial(convertWeightToImperial(numericValue))
          setGoalRateLoseMetric(numericValue)
        }
        setGoalRate(numericValue)

        setLastFocusedInput('lose')
        break

      // need to update gain and goalWeightGain
      case 'gain':
        updateGoalInteractions(undefined, goalRate)
        if (unit === 'imperial') {
          // Set Imperial Measurements
          setGoalRateGainImperial(numericValue)
          setGoalRateGainMetric(convertWeightToMetric(numericValue))
          setGoalInfo((prev) => ({
            ...prev,
            goalRateGainImperial: numericValue,
            goalRateGainMetric: convertWeightToMetric(numericValue),
          }))
        } else {
          // Set Metric Measurements
          setGoalRateGainImperial(convertWeightToImperial(numericValue))
          setGoalRateGainMetric(numericValue)
          setGoalInfo((prev) => ({
            ...prev,
            goalRateGainImperial: convertWeightToImperial(numericValue),
            goalRateGainMetric: numericValue,
          }))
        }
        setGoalRate(numericValue)

        setLastFocusedInput('gain')
        break

      case 'goalWeightLose':
        // Set Imperial Measurements
        if (unit === 'imperial') {
          setGoalWeightLoseImperial(numericValue)
          setGoalWeightLoseMetric(convertWeightToMetric(numericValue))

          setGoalInfo((prevGoal) => ({
            ...prevGoal,
            goalSelection: 'lose',
            goalWeightLoseImperial: numericValue,
            goalWeightLoseMetric: convertWeightToMetric(numericValue),
          }))
        }
        // Set Metric Measurements
        else {
          setGoalWeightLoseImperial(convertWeightToImperial(numericValue))
          setGoalWeightLoseMetric(numericValue)

          setGoalInfo((prevGoal) => ({
            ...prevGoal,
            goalSelection: 'lose',
            goalWeightLoseImperial: convertWeightToImperial(numericValue),
            goalWeightLoseMetric: numericValue,
          }))
        }

        setGoalWeight(numericValue)
        setLastFocusedInput('goalWeightLose')

        break

      case 'goalWeightGain':
        // Set Imperial Measurements
        if (unit === 'imperial') {
          setGoalWeightGainImperial(numericValue)
          setGoalWeightGainMetric(convertWeightToMetric(numericValue))

          setGoalInfo((prevGoal) => ({
            ...prevGoal,
            goalSelection: 'gain',
            goalWeightGainImperial: numericValue,
            goalWeightGainMetric: convertWeightToMetric(numericValue),
          }))
        }
        // Set Metric Measurements
        else {
          setGoalWeightGainImperial(convertWeightToImperial(numericValue))
          setGoalWeightGainMetric(numericValue)

          setGoalInfo((prevGoal) => ({
            ...prevGoal,
            goalSelection: 'gain',
            goalWeightGainImperial: convertWeightToImperial(numericValue),
            goalWeightGainMetric: numericValue,
          }))
        }

        setGoalWeight(numericValue)
        setLastFocusedInput('goalWeightGain')

        break

      default:
        break
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log('handleFormSubmit')

    event.preventDefault()

    // console.log('statsInfo in submit: ', statsInfo)
    calculateDateFromAge(age)

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
    console.log('handleCheck')

    setChecked(event.target.checked)
  }

  ///////////////////
  // Update Functions
  ///////////////////
  function updateGoalInteractions(
    weight?: number,
    rate?: number,
    date?: Date | null
  ) {
    console.log('updateGoalInteractions')
    const lastInteraction = interactionData.lastInteraction

    let currentInteraction: InteractionType = null

    if (weight !== undefined) {
      interactionData.goalWeight = weight
      currentInteraction = 'weight'
    }
    if (rate !== undefined) {
      interactionData.goalRate = rate
      currentInteraction = 'rate'
    }
    if (date !== undefined) {
      //} && isValidDate(date)) {
      interactionData.goalDate = date
      currentInteraction = 'date'
    }
    console.log(interactionData)
    console.log('currentInteraction: ', currentInteraction)
    console.log('lastInteraction: ', lastInteraction)
    if (currentInteraction && currentInteraction !== lastInteraction) {
      console.log('made it')
      if (lastInteraction !== currentInteraction) {
        console.log('in here?')
        interactionData.previousInteraction = lastInteraction
      }
      interactionData.lastInteraction = currentInteraction
    }

    if (rate === undefined) {
      if (unit === 'imperial') {
        if (goalInfo.goalSelection === 'lose') {
          interactionData.goalRate = goalRateLoseImperial
        } else if (goalInfo.goalSelection === 'gain') {
          interactionData.goalRate = goalRateGainImperial
        }
      } else if (unit === 'metric') {
        if (goalInfo.goalSelection === 'lose') {
          interactionData.goalRate = goalRateLoseMetric
        } else if (goalInfo.goalSelection === 'gain') {
          interactionData.goalRate = goalRateGainMetric
        }
      }
    }

    if (weight === undefined) {
      if (unit === 'imperial') {
        if (goalInfo.goalSelection === 'lose') {
          interactionData.goalWeight = goalWeightLoseImperial
        } else if (goalInfo.goalSelection === 'gain') {
          interactionData.goalWeight = goalWeightGainImperial
        }
      } else if (unit === 'metric') {
        if (goalInfo.goalSelection === 'lose') {
          interactionData.goalWeight = goalWeightLoseMetric
        } else if (goalInfo.goalSelection === 'gain') {
          interactionData.goalWeight = goalWeightGainMetric
        }
      }
    }

    if (date === undefined) {
      console.log('1')
      interactionData.goalDate = goalDate!
      console.log('1: ', interactionData)
    }

    // Why is this here?
    if (!interactionData.goalDate) {
      console.log('2')
      interactionData.goalDate = null
    }

    console.log(interactionData)
  }

  function updateAllWeightStates(goal: string, goalWeight: number) {
    console.log('updateAllWeightStates')
    if (unit === 'imperial') {
      if (goal === 'lose') {
        setGoalWeightLoseImperial(goalWeight)
        setGoalWeightLoseMetric(convertWeightToMetric(goalWeight))
      } else if (goal === 'gain') {
        setGoalWeightGainImperial(goalWeight)
        setGoalWeightGainMetric(convertWeightToMetric(goalWeight))
      }
    } else if (unit === 'metric') {
      if (goal === 'lose') {
        setGoalWeightLoseImperial(convertWeightToImperial(goalWeight))
        setGoalWeightLoseMetric(goalWeight)
      } else if (goal === 'gain') {
        setGoalWeightGainImperial(convertWeightToImperial(goalWeight))
        setGoalWeightGainMetric(goalWeight)
      }
    }
    setGoalWeight(goalWeight)
  }

  function updateAllRateStates(goal: string, goalRate: number) {
    console.log('updateAllRateStates')
    if (unit === 'imperial') {
      if (goal === 'lose') {
        setGoalRateLoseImperial(goalRate)
        setGoalRateLoseMetric(convertWeightToMetric(goalRate))
      } else if (goal === 'gain') {
        setGoalRateGainImperial(goalRate)
        setGoalRateGainMetric(convertWeightToMetric(goalRate))
      }
    } else if (unit === 'metric') {
      if (goal === 'lose') {
        setGoalRateLoseImperial(convertWeightToImperial(goalRate))
        setGoalRateLoseMetric(goalRate)
      } else if (goal === 'gain') {
        setGoalRateGainImperial(convertWeightToImperial(goalRate))
        setGoalRateGainMetric(goalRate)
      }
    }
    setGoalRate(goalRate)
  }

  // Go through this one
  const updateWeightFromDateOnly = (goalDate: Date) => {
    // const dateInput = document.getElementById('date-input') as HTMLInputElement

    // dateInput.setCustomValidity('')

    //   if (calculateDaysBetweenTodayAndGoalDate(goalDate) < 0) {
    //     dateInput.setCustomValidity('The goal date must be in the future.')

    //     dateInput.focus()

    // interactionData.lastInteraction =
    // interactionData.previousInteraction
    //   }

    if (interactionData.previousInteraction === 'rate') {
      const today = new Date()
      if (isValidDate(today)) {
        let targetWeight = 0
        const differenceInDays = calculateWeeksUntilGoalDate(goalDate)
        const totalAmount = goalRate * differenceInDays

        if (unit === 'imperial') {
          if (goalInfo.goalSelection === 'lose') {
            targetWeight = weight - totalAmount
          } else if (goalInfo.goalSelection === 'gain') {
            targetWeight = weight + totalAmount
          }
        } else if (unit === 'metric') {
          if (goalInfo.goalSelection === 'lose') {
            targetWeight = weight - totalAmount
          } else if (goalInfo.goalSelection === 'gain') {
            targetWeight = weight + totalAmount
          }
        }

        if (unit === 'imperial') {
          if (goalInfo.goalSelection === 'lose') {
            setGoalWeightLoseImperial(targetWeight)
            setGoalWeightLoseMetric(convertWeightToMetric(targetWeight))
            setGoalInfo((prev) => ({
              ...prev,
              goalWeightLoseImperial: targetWeight,
              goalWeightLoseMetric: convertWeightToMetric(targetWeight),
            }))
          } else if (goalInfo.goalSelection === 'gain') {
            setGoalWeightGainImperial(targetWeight)
            setGoalWeightGainMetric(convertWeightToMetric(targetWeight))
            setGoalInfo((prev) => ({
              ...prev,
              goalWeightGainImperial: targetWeight,
              goalWeightGainMetric: convertWeightToMetric(targetWeight),
            }))
          }
        } else if (unit === 'metric') {
          if (goalInfo.goalSelection === 'lose') {
            setGoalWeightLoseMetric(targetWeight)
            setGoalWeightLoseImperial(convertWeightToImperial(targetWeight))
            setGoalInfo((prev) => ({
              ...prev,
              goalWeightLoseImperial: convertWeightToImperial(targetWeight),
              goalWeightLoseMetric: targetWeight,
            }))
          } else if (goalInfo.goalSelection === 'gain') {
            setGoalWeightGainMetric(targetWeight)
            setGoalWeightGainImperial(convertWeightToImperial(targetWeight))
            setGoalInfo((prev) => ({
              ...prev,
              goalWeightGainImperial: convertWeightToImperial(targetWeight),
              goalWeightGainMetric: targetWeight,
            }))
          }
        }
      } else {
        console.log('Not Valid')
      }
    } else if (interactionData.previousInteraction === 'weight') {
      // Update Rate
      setGoalRate(calculateGoalRateFromWeightAndDate(goalWeight, goalDate))
      if (unit === 'imperial') {
        if (goalInfo.goalSelection === 'lose') {
          setGoalRateLoseImperial(
            Number(
              calculateGoalRateFromWeightAndDate(goalWeight, goalDate).toFixed(
                1
              )
            )
          )
        } else if (goalInfo.goalSelection === 'gain') {
          setGoalRateGainImperial(
            Number(
              calculateGoalRateFromWeightAndDate(goalWeight, goalDate).toFixed(
                1
              )
            )
          )
        }
      } else if (unit === 'metric') {
        if (goalInfo.goalSelection === 'lose') {
          setGoalRateLoseMetric(
            Number(
              calculateGoalRateFromWeightAndDate(goalWeight, goalDate).toFixed(
                1
              )
            )
          )
        } else if (goalInfo.goalSelection === 'gain') {
          console.log(goalWeight)
          setGoalRateGainMetric(
            Number(
              calculateGoalRateFromWeightAndDate(goalWeight, goalDate).toFixed(
                1
              )
            )
          )
        }
      }
    } else if (
      interactionData.lastInteraction === 'date' &&
      // MAY BE NEEDED IN SOME FORM
      interactionData.previousInteraction === null &&
      interactionData.goalWeight
    ) {
      if (goalWeight !== 0 && goalWeight !== undefined) {
        calculateGoalRateFromWeightAndDate(goalWeight, goalDate)
      }
    }
    console.log('updateWeightFromDateOnly: ', interactionData)
  }

  ///////////////
  // Calculations
  ///////////////

  // Calculate WEIGHT using RATE and DATE
  const calculateGoalWeightFromRateAndDate = (
    goal: string,
    goalRate: number
  ): number => {
    console.log('calculateGoalWeightFromRateAndDate')

    if (goalDate) {
      const parseGoalDate = new Date(goalDate)
      const weeksToTargetDate = calculateWeeksUntilGoalDate(parseGoalDate)
      const rate = goalRate
      console.log('parseGoalDate: ', parseGoalDate)
      console.log('weeksToTargetDate: ', weeksToTargetDate)
      console.log('goalRate: ', goalRate)
      const targetWeight =
        goal === 'lose'
          ? Number(weight - weeksToTargetDate * rate)
          : Number((weight + weeksToTargetDate * rate).toFixed(2))
      console.log('targetWeight: ', targetWeight)
      updateAllWeightStates(goal, targetWeight)

      return targetWeight
    } else if (goalWeightLoseImperial || goalWeightGainImperial) {
      if (goal === 'lose' && goalWeightLoseImperial) {
        return goalWeightLoseImperial
      } else if (goal === 'gain' && goalWeightGainImperial) {
        return goalWeightGainImperial
      }
    }
    return 0
  }

  // Need to finish putting error message in here. Clean it up
  // Calculate RATE using WEIGHT and DATE
  function calculateGoalRateFromWeightAndDate(
    goalWeight: number,
    goalDate: Date
  ): number {
    console.log('calculateGoalRateFromWeightAndDate')
    let goal = goalInfo.goalSelection

    if (isValidDate(goalDate) && goalWeight !== 0) {
      const differenceInDays = calculateDaysBetweenTodayAndGoalDate(goalDate)
      // const weightInput = document.getElementById(
      //   'lose-weight-input'
      // ) as HTMLInputElement
      const dateInput = document.getElementById(
        'date-input'
      ) as HTMLInputElement

      getElements('weightInput', '')
      // if (weightInput) {
      // weightInput.setCustomValidity('')
      // }
      dateInput.setCustomValidity('')

      if (differenceInDays >= 0) {
        let tempGoalRate = 0
        if (goal === 'lose') {
          tempGoalRate = (weight - goalWeight) / (differenceInDays / 7)
          console.log(tempGoalRate)
          if (tempGoalRate <= maxRangeLose && tempGoalRate > 0) {
            updateAllRateStates(goal, tempGoalRate)
            return tempGoalRate
          } else if (tempGoalRate === 0) {
            updateAllRateStates(goal, 1)
            return 1
          } else {
            getElements(
              'weightInput',
              'Goal weight is not attainable using healthy methods!'
            )
            // if (weightInput) {
            //   weightInput.setCustomValidity(
            //     'Goal weight is not attainable using healthy methods!!!!!!!!!!!!!!!!!!!!!!!!!!!.'
            //   )
            //   console.log(interactionData)
            //   // Needs to report/pop up
            //   console.log('PUTTING FOCUS ON WEIGHT')
            //   // weightInput.focus()
            //   weightInput.reportValidity()
            //   weightInput.setCustomValidity('')
            // interactionData.previousInteraction =
            //   interactionData.lastInteraction
            // }
            updateAllRateStates(goal, 0)
            return 0
          }
        }

        if (goal === 'gain') {
          tempGoalRate = (goalWeight - weight) / (differenceInDays / 7)
          if (tempGoalRate <= 2 && tempGoalRate > 0) {
            return tempGoalRate
          } else if (tempGoalRate === 0) {
            return 1
          } else {
            getElements(
              'weightInput',
              'Goal weight is not attainable using healthy methods!'
            )

            // if (weightInput) {
            //   weightInput.setCustomValidity(
            //     'Goal weight is not attainable using healthy methods.'
            //   )
            //   console.log(
            //     'PUTTING FOCUS ON WEIGHT################################'
            //   )
            //   weightInput.focus()
            //   interactionData.lastInteraction =
            //     interactionData.previousInteraction
            // }
            return 0
          }
        }
        return 0
      } else {
        dateInput.setCustomValidity('The goal date must be in the future.')
        console.log('PUTTING FOCUS ON DATE')
        dateInput.focus()
        interactionData.lastInteraction = interactionData.previousInteraction
        dateInput.reportValidity()
      }
    }
    return goalRate
  }

  // Calculate DATE using WEIGHT and RATE
  const calculateGoalDateFromWeightAndRate = () => {
    console.log('calculateGoalDateFromWeightAndRate')
    // const weightInput = document.getElementById(
    //   'lose-weight-input'
    // ) as HTMLInputElement
    // weightInput.setCustomValidity('')
    // console.log(weightInput.validationMessage)
    getElements('weightInput', '')
    if (goalRate !== 0 && goalWeight !== 0) {
      const today = new Date()
      const daysToTargetWeight = Math.abs(
        ((weight - goalWeight) * 7) / goalRate
      )
      const targetDate = new Date(
        today.setDate(today.getDate() + daysToTargetWeight)
      )

      setGoalDate(targetDate)

      setGoalInfo((prev) => ({
        ...prev,
        goalDate: targetDate,
      }))
      // weightInput.reportValidity()
    }
  }

  const calculateWeeksUntilGoalDate = (goalDate: Date): number => {
    console.log('calculateWeeksUntilGoalDate')
    const today = new Date()
    if (isValidDate(goalDate)) {
      if (goalDate > today) {
        const differenceInDays = calculateDaysBetweenTodayAndGoalDate(goalDate)
        const differenceInWeeks = differenceInDays / 7

        return differenceInWeeks
      }
    }

    return 0
  }

  function calculateDaysBetweenTodayAndGoalDate(goalDate: Date) {
    console.log('calculateDaysBetweenTodayAndGoalDate')
    const newDate = new Date(goalDate)
    if (isValidDate(goalDate)) {
      const today = new Date()
      const utc1 = Date.UTC(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate()
      )
      const utc2 = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
      const differenceInDays = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24))

      return differenceInDays
    }
    console.warn('Invalid goal date:', goalDate)
    return 0
  }

  // Calculate AGE using DATE OF BIRTH
  const calculateAge = (dob: Date): number => {
    console.log('calculateAge')
    const today = new Date()
    if (isValidDate(today) && isValidDate(dob)) {
      let age = today.getFullYear() - dob.getFullYear()
      const monthDifference = today.getMonth() - dob.getMonth()
      const dayDifference = today.getDate() - dob.getDate()

      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--
      }
      setAge(age)
      return age
    }
    return 0
  }

  // Calculate DATE OF BIRTH using AGE
  const calculateDateFromAge = (age: number) => {
    console.log('calculateDateFromAge')
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

  // // Blurs
  // // WORK STILL
  // // globally, if no date, make date 1 week out
  // //// If i grab weight then rate, weirdness
  // function handleBlurGoalDate() {
  //   // update Date based on GoalWeight and GoalRate
  //   console.log('ID: ', interactionData)
  //   if (isValidDate(goalDate)) {
  //     // Lock rate, change date, weight is variable
  //     if (interactionData.previousInteraction === 'rate') {
  //       console.log(interactionData.previousInteraction)
  //       // Lock weight, change date, rate is variable
  //     } else if (interactionData.previousInteraction === 'weight') {
  //       console.log(interactionData.previousInteraction)
  //     }
  //   }
  // }

  //something is pulling focus from date to weight
  // Need to go through this one
  function handleBlurGoalRate() {
    console.log('handleBlurGoalRate')
    if (
      interactionData.previousInteraction === 'date' ||
      interactionData.previousInteraction === null
    ) {
      calculateGoalWeightFromRateAndDate(goalInfo.goalSelection!, goalRate)
    } else if (interactionData.previousInteraction === 'weight') {
      calculateGoalDateFromWeightAndRate()
      // weightInput.setCustomValidity('')
      // getElements('weightInput', '')

      // weightInput.reportValidity()
    }
  }

  // EVERYTHING IN HERE should have lastInteraction of weight
  function handleBlurGoalWeight() {
    console.log('handleBlurGoalWeight')
    const isValid = isValidWeight()

    if (isValid) {
      updateGoalInteractions(goalWeight)
      if (
        interactionData.previousInteraction === 'date' ||
        interactionData.previousInteraction === null
      ) {
        calculateGoalRateFromWeightAndDate(goalWeight, goalDate)
      } else if (interactionData.previousInteraction === 'rate') {
        calculateGoalDateFromWeightAndRate()
      } else {
        console.log('Error in handleBlurGoalWeight')
      }
    }
  }

  // Blur for DATE OF BIRTH
  function handleBlurDob() {
    console.log('handleBlurDob')
    if (month && day && year && year.toString().length === 4) {
      const dob = new Date(year, month - 1, day)

      if (dob) {
        //isValidDate(dob)) {
        setDateOfBirth(dob)
        setAge(calculateAge(dob))
        setStatsInfo((prev) => ({
          ...prev,
          doB: dob,
        }))
      }
    }
  }

  // Handlers to update focus state
  const handleFocus = (field: string) => {
    console.log('handleFocus')
    setFocusedField(field)
  }

  // NEEDED?
  useEffect(() => {
    console.log('useEffect, handleBlurGoalRate')
    handleBlurGoalRate()
  }, [goalRate])

  // Get user and load data if data is in db
  useEffect(() => {
    console.log('useEffect, fetching...')
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

          // Set stats
          if (stats) {
            delete stats.id
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

            // unit === 'imperial'
            //   ? goal.goalSelection === 'lose'
            //     ? (setGoalRate(goal.goalRateLoseImperial),
            //       setGoalWeight(goal.goalWeightLoseImperial))
            //     : (setGoalRate(goal.goalRateGainImperial),
            //       setGoalWeight(goal.goalWeightGainImperial))
            //   : goal.goalSelection === 'lose'
            //     ? (setGoalRate(goal.goalRateLoseMetric),
            //       setGoalWeight(goal.goalWeightLoseMetric))
            //     : (setGoalRate(goal.goalRateGainMetric),
            //       setGoalWeight(goal.goalWeightGainMetric))

            setGoalRateLoseImperial(goal.goalRateLoseImperial)
            setGoalRateLoseMetric(goal.goalRateLoseMetric)
            setGoalWeightLoseImperial(goal.goalWeightLoseImperial)
            setGoalWeightLoseMetric(goal.goalWeightLoseMetric)
            setGoalRateGainImperial(goal.goalRateGainImperial)
            setGoalRateGainMetric(goal.goalRateGainMetric)
            setGoalWeightGainImperial(goal.goalWeightGainImperial)
            setGoalWeightGainMetric(goal.goalWeightGainMetric)
            setGoalDate(goal.goalDate)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  // Handle mouse clicks outside Age, Month, Day, Year, DoB date
  useEffect(() => {
    console.log('useEffect, handleClickOutside')
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

  //  Up to 1% of bodyweight per week
  //  10%-20% (20% MAX) above maintenance calories.
  //  0.5lb - 1lb / week
  //  POST CUT - 0.5% for 2 months after

  function getElements(input: string, text: string) {
    if (input === 'weightInput') {
      const weightInput = document.getElementById(
        'lose-weight-input'
      ) as HTMLInputElement
      weightInput.setCustomValidity(text)
      weightInput.reportValidity()
    }

    const rateInput = document.getElementById(
      'lose-rate-input'
    ) as HTMLInputElement

    rateInput.setCustomValidity(text)
    rateInput.reportValidity()
    // const loseWeightInput = document.getElementById(
    //   'lose-weight-input'
    // ) as HTMLInputElement
    // const gainWeightInput = document.getElementById(
    //   'gain-weight-input'
    // ) as HTMLInputElement
  }

  return (
    <main className="user-page">
      {/* <div className="vert"></div> */}
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
                      onChange={(date, event) => {
                        event?.preventDefault()
                        if (date) {
                          setDateOfBirth(date)
                          // updateAgeFromDate(date)
                          calculateAge(date)
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
                // onBlur={handleBlurWeight}
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

          {weight !== 0 && (
            <div className="user-goals">
              <div className="goal-heading">
                What is your goal and goal weight?
              </div>
              <>
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
                        id="lose-rate-input"
                        className="goal-rate"
                        type="number"
                        name="lose"
                        placeholder="lbs per week"
                        value={displayGoalRate}
                        onChange={(event) => {
                          updateGoalInteractions(undefined, goalRate)
                          handleInputChange(event)
                        }}
                        onBlur={handleBlurGoalRate}
                        required
                      />
                      {unit === 'imperial' ? 'lbs' : 'kg'}
                      <div className="date-picker-goal">
                        <input
                          id="lose-weight-input"
                          className="goal-weight"
                          type="number"
                          name="goalWeightLose"
                          placeholder="Goal Weight"
                          min={minLoseWeight}
                          max={weight}
                          step="0.1"
                          value={displayGoalWeightValue || ''}
                          onChange={(event) => {
                            updateGoalInteractions(goalWeight)
                            handleInputChange(event)
                          }}
                          onBlur={handleBlurGoalWeight}
                          required
                        />
                        {unit === 'imperial' ? 'lbs' : 'kg'}
                        <DatePicker
                          id="date-input"
                          className="date-picker-calendar"
                          selected={goalDate}
                          onChange={(date, event) => {
                            event?.preventDefault()
                            updateGoalInteractions(undefined, undefined, date)
                            if (date) {
                              setGoalDate(date)
                              updateWeightFromDateOnly(date)
                              setGoalInfo((prev) => ({
                                ...prev,
                                goalDate: date,
                              }))
                            }
                          }}
                          // onBlur={handleBlurGoalDate}
                        />
                      </div>
                      <input
                        type="range"
                        name="lose"
                        min="0"
                        max={maxRangeLose}
                        step="0.5"
                        className="slider-input"
                        value={
                          unit === 'imperial'
                            ? goalRateLoseImperial
                            : goalRateLoseMetric
                        }
                        onChange={(event) => {
                          updateGoalInteractions(undefined, goalRate, undefined)
                          handleInputChange(event)
                        }}
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
                      disabled={weight === 0}
                    />
                    Gain Muscle
                  </div>
                  {checkedGoals.gain ? (
                    <div className="input-container">
                      <input
                        id="gain-rate-input"
                        className="goal-rate"
                        type="number"
                        name="gain"
                        placeholder="lbs per week"
                        // value={goalRateGain}
                        value={displayGoalRate}
                        onChange={(event) => {
                          updateGoalInteractions(undefined, goalRate)
                          handleInputChange(event)
                        }}
                        onBlur={handleBlurGoalRate}
                        required
                      />
                      {unit === 'imperial' ? 'lbs' : 'kg'}
                      <div className="date-picker-goal">
                        <input
                          id="gain-weight-input"
                          className="goal-weight"
                          type="number"
                          name="goalWeightGain"
                          placeholder="Goal Weight"
                          min={weight}
                          max={maxGainWeight}
                          step="0.1"
                          value={displayGoalWeightValue || ''}
                          onChange={(event) => {
                            updateGoalInteractions(goalWeight)
                            handleInputChange(event)
                          }}
                          onBlur={handleBlurGoalWeight}
                          required
                        />
                        {unit === 'imperial' ? 'lbs' : 'kg'}
                        <DatePicker
                          id="date-input"
                          className="date-picker-calendar"
                          selected={goalDate}
                          onChange={(date, event) => {
                            event?.preventDefault()
                            updateGoalInteractions(undefined, undefined, date)
                            if (date) {
                              setGoalDate(date)
                              updateWeightFromDateOnly(date)
                              setGoalInfo((prev) => ({
                                ...prev,
                                goalDate: date,
                              }))
                            }
                          }}
                          // onBlur={handleBlurGoalDate}
                        />
                      </div>
                      <input
                        type="range"
                        name="gain"
                        min="0"
                        max={maxRangeGain}
                        step={unit === 'imperial' ? '0.5' : '.2275'}
                        className="slider-input"
                        value={
                          unit === 'imperial'
                            ? goalRateGainImperial
                            : goalRateGainMetric
                        }
                        onChange={(event) => {
                          updateGoalInteractions(undefined, goalRate, undefined)
                          handleInputChange(event)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="gain-placeholder">
                      <p>Up to 2 lbs/1 kg per week</p>
                    </div>
                  )}
                  {/* Up to 2 lbs/1 kg per week
                     Up to 1% of bodyweight per week
                    10%-20% (20% MAX) above maintenance calories. 
                    0.5lb - 1lb / week
                    POST CUT - 0.5% for 2 months after */}
                </label>
                <label>
                  <div>
                    <input
                      type="checkbox"
                      checked={checkedGoals.maintain}
                      onChange={() => handleCheckboxChange('maintain')}
                      disabled={weight === 0}
                    />
                    Maintain Weight & Muscle
                  </div>
                </label>
              </>
            </div>
          )}
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
