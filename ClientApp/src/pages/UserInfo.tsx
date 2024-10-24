import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation } from 'react-query'
import { authHeader } from '../types/auth'

import {
  APIError,
  GoalOptionsType,
  GoalType,
  interactionData,
  InteractionType,
  SexOptionsType,
  StatsType,
} from '../types/types'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import useLoadUser from '../hooks/useLoadUser'

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

const UserInfo = () => {
  const navigate = useNavigate()
  const { id } = useParams() as { id: string }

  const { user, isUserLoading } = useLoadUser(id)

  const [errorMessage, setErrorMessage] = useState('')
  const [focusedField, setFocusedField] = useState('')
  const [lastFocusedInput, setLastFocusedInput] = useState('')
  const [checked, setChecked] = useState(false)

  // const [user, setUser] = useState(null)

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

  const [goalWeightLoseImperial, setGoalWeightLoseImperial] = useState(0)
  const [goalRateLoseImperial, setGoalRateLoseImperial] = useState(0)
  const [goalWeightGainImperial, setGoalWeightGainImperial] = useState(0)
  const [goalRateGainImperial, setGoalRateGainImperial] = useState(0)
  const [goalWeightLoseMetric, setGoalWeightLoseMetric] = useState(0)
  const [goalRateLoseMetric, setGoalRateLoseMetric] = useState(0)
  const [goalWeightGainMetric, setGoalWeightGainMetric] = useState(0)
  const [goalRateGainMetric, setGoalRateGainMetric] = useState(0)
  const [goalWeight, setGoalWeight] = useState(0)
  const [goalRate, setGoalRate] = useState(0)

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
  })

  const maxRangeLose = Math.round(weight * 0.01 * 2) / 2
  const maxRangeGain = unit === 'imperial' ? 2 : 0.91

  const effectiveLoss = Number(
    (
      maxRangeLose *
      (calculateDaysBetweenTodayAndGoalDate(goalDate) / 7)
    ).toFixed(1)
  )
  const effectiveGain = Number(
    (
      maxRangeGain *
      (calculateDaysBetweenTodayAndGoalDate(goalDate!) / 7)
    ).toFixed(1)
  )

  const minLoseWeight = Number((weight - effectiveLoss).toFixed(1))
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

  /////////
  // Toggle
  /////////
  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'imperial' ? 'metric' : 'imperial'
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
      // FINISH THIS? NEEDED?
      // if (newUnit === 'imperial') {
      //   if (goalInfo.goalSelection === 'lose') {
      //     setGoalRate(goalRate)
      //   } else if (goalInfo.goalSelection === 'gain') {
      //     //
      //   }
      // } else if (newUnit === 'metric') {
      //   if (goalInfo.goalSelection === 'lose') {
      //     //
      //   } else if (goalInfo.goalSelection === 'gain') {
      //     //
      //   }
      // }

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
    return date instanceof Date && !isNaN(date.getTime())
  }

  // Make sure weights are valid
  const isValidWeight = (): boolean => {
    if (statsInfo.heightMetric) {
      if (goalInfo.goalSelection === 'lose') {
        const bmi =
          goalWeightLoseMetric / Math.pow(statsInfo.heightMetric / 100, 2)

        if (bmi < 18.5) {
          // MAY NOT NEED STATE VARIABLE HERE...
          const minimumAllowedWeight =
            18.5 * Math.pow(statsInfo.heightMetric / 100, 2)

          // Needs an error message to pop up and tell them that would be unhealthy
          unit === 'imperial'
            ? setGoalWeightLoseImperial(
                Number(convertWeightToImperial(minimumAllowedWeight).toFixed(1))
              )
            : setGoalWeightLoseMetric(
                convertWeightToMetric(Number(minimumAllowedWeight.toFixed(1)))
              )
        }
        return false
      } else if (goalWeight > weight) {
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
    const { name, value } = event.target
    const numericValue = parseFloat(value)

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
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.2,
              activityLevelLabel: value,
            }))
            break

          case 'Light':
            setActivityLevelLabel(value)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.425,
              activityLevelLabel: value,
            }))
            break

          case 'Moderate':
            setActivityLevelLabel(value)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.55,
              activityLevelLabel: value,
            }))
            break

          case 'Heavy':
            setActivityLevelLabel(value)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.75,
              activityLevelLabel: value,
            }))
            break

          case 'Athlete':
            setActivityLevelLabel(value)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.9,
              activityLevelLabel: value,
            }))
            break

          case 'None':
            setActivityLevelLabel(value)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1,
              activityLevelLabel: value,
            }))
            break
        }
        break

      case 'lose':
        if (unit === 'imperial') {
          // Set Imperial Measurements
          setGoalRateLoseImperial(numericValue)
          setGoalRateLoseMetric(convertWeightToMetric(numericValue))
          setGoalInfo((prev) => ({
            ...prev,
            goalRateLoseImperial: numericValue,
            goalRateLoseMetric: convertWeightToMetric(numericValue),
          }))
        } else if (unit === 'metric') {
          // Set Metric Measurements
          setGoalRateLoseImperial(convertWeightToImperial(numericValue))
          setGoalRateLoseMetric(numericValue)
          setGoalInfo((prev) => ({
            ...prev,
            goalRateLoseImperial: convertWeightToImperial(numericValue),
            goalRateLoseMetric: numericValue,
          }))
        }
        setGoalRate(numericValue)
        setLastFocusedInput('lose')
        break

      // need to update gain and goalWeightGain
      case 'gain':
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
    event.preventDefault()

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
      interactionData.goalDate = date
      currentInteraction = 'date'
    }

    if (currentInteraction && currentInteraction !== lastInteraction) {
      if (lastInteraction !== currentInteraction) {
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
      interactionData.goalDate = goalDate!
    }

    // Why is this here?
    if (!interactionData.goalDate) {
      interactionData.goalDate = null
    }
  }

  function updateAllWeightStates(goal: string, goalWeight: number) {
    if (unit === 'imperial') {
      if (goal === 'lose') {
        setGoalWeightLoseImperial(goalWeight)
        setGoalWeightLoseMetric(convertWeightToMetric(goalWeight))
        setGoalInfo((prev) => ({
          ...prev,
          goalWeightLoseImperial: goalWeight,
          goalWeightLoseMetric: convertWeightToMetric(goalWeight),
        }))
      } else if (goal === 'gain') {
        setGoalWeightGainImperial(goalWeight)
        setGoalWeightGainMetric(convertWeightToMetric(goalWeight))
        setGoalInfo((prev) => ({
          ...prev,
          goalWeightGainImperial: goalWeight,
          goalWeightGainMetric: convertWeightToMetric(goalWeight),
        }))
      }
    } else if (unit === 'metric') {
      if (goal === 'lose') {
        setGoalWeightLoseImperial(convertWeightToImperial(goalWeight))
        setGoalWeightLoseMetric(goalWeight)
        setGoalInfo((prev) => ({
          ...prev,
          goalWeightLoseImperial: convertWeightToImperial(goalWeight),
          goalWeightLoseMetric: goalWeight,
        }))
      } else if (goal === 'gain') {
        setGoalWeightGainImperial(convertWeightToImperial(goalWeight))
        setGoalWeightGainMetric(goalWeight)
        setGoalInfo((prev) => ({
          ...prev,
          goalWeightGainImperial: convertWeightToImperial(goalWeight),
          goalWeightGainMetric: goalWeight,
        }))
      }
    }
    setGoalWeight(goalWeight)
  }

  function updateAllRateStates(goal: string, goalRate: number) {
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
    const goal = goalInfo.goalSelection
    if (interactionData.previousInteraction === 'rate') {
      const today = new Date()
      if (isValidDate(today)) {
        const differenceInDays = calculateWeeksUntilGoalDate(goalDate)
        const totalAmount = goalRate * differenceInDays
        goal === 'lose'
          ? updateAllWeightStates(goal, weight - totalAmount)
          : updateAllWeightStates(goal!, weight + totalAmount)
      } else {
        console.log('Not Valid')
      }
    } else if (interactionData.previousInteraction === 'weight') {
      // Update Rate
      const tempRate = calculateGoalRateFromWeightAndDate(goalWeight, goalDate)
      updateAllRateStates(goal!, tempRate)
    } else if (
      interactionData.lastInteraction === 'date' &&
      // MAY BE NEEDED IN SOME FORM
      interactionData.previousInteraction === null &&
      interactionData.goalWeight
    ) {
      if (goalWeight !== 0 && goalWeight !== undefined) {
        const tempRate = calculateGoalRateFromWeightAndDate(
          goalWeight,
          goalDate
        )
        updateAllRateStates(goal!, tempRate)
      }
    }
  }

  ///////////////
  // Calculations
  ///////////////

  // Calculate WEIGHT using RATE and DATE
  const calculateGoalWeightFromRateAndDate = (
    goal: string,
    goalRate: number
  ): number => {
    if (goalDate) {
      const parseGoalDate = new Date(goalDate)
      const weeksToTargetDate = calculateWeeksUntilGoalDate(parseGoalDate)
      const rate = goalRate

      const targetWeight =
        goal === 'lose'
          ? Number(weight - weeksToTargetDate * rate)
          : Number((weight + weeksToTargetDate * rate).toFixed(2))

      updateAllWeightStates(goal, targetWeight)

      return targetWeight
    }
    return 0
  }

  // Need to finish putting error message in here. Clean it up
  // Calculate RATE using WEIGHT and DATE
  function calculateGoalRateFromWeightAndDate(
    goalWeight: number,
    goalDate: Date
  ): number {
    let goal = goalInfo.goalSelection

    if (isValidDate(goalDate) && goalWeight !== 0) {
      const differenceInDays = calculateDaysBetweenTodayAndGoalDate(goalDate)
      const dateInput = document.getElementById(
        'date-input'
      ) as HTMLInputElement

      getElements('weightInput', '')

      dateInput.setCustomValidity('')

      if (differenceInDays >= 0) {
        let tempGoalRate = 0
        if (goal === 'lose') {
          tempGoalRate = (weight - goalWeight) / (differenceInDays / 7)
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
        dateInput.focus()
        interactionData.lastInteraction = interactionData.previousInteraction
        dateInput.reportValidity()
      }
    }
    return goalRate
  }

  // Calculate DATE using WEIGHT and RATE
  const calculateGoalDateFromWeightAndRate = () => {
    // console.log('calculateGoalDateFromWeightAndRate')
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
    }
  }

  const calculateWeeksUntilGoalDate = (goalDate: Date): number => {
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
    const newDate = new Date(goalDate)

    if (isValidDate(newDate)) {
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

  ////////
  // Blurs
  ////////

  //something is pulling focus from date to weight
  // Need to go through this one
  function handleBlurGoalRate() {
    if (
      interactionData.previousInteraction === 'date' ||
      interactionData.previousInteraction === null
    ) {
      calculateGoalWeightFromRateAndDate(goalInfo.goalSelection!, goalRate)
    } else if (interactionData.previousInteraction === 'weight') {
      calculateGoalDateFromWeightAndRate()
    }
  }

  // EVERYTHING IN HERE should have lastInteraction of weight
  function handleBlurGoalWeight() {
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
    if (month && day && year && year.toString().length === 4) {
      const dob = new Date(year, month - 1, day)

      if (dob) {
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
    setFocusedField(field)
  }

  const handleStats = (stats: StatsType) => {
    if (!stats) return
    // Set stats
    if (stats) {
      delete stats.id
      setStatsInfo({
        ...stats,
        userId: user.id,
      })
      setAge(stats.age || 0)
      setDateOfBirth(stats.doB!)
      if (stats.doB) {
        const dob = new Date(stats.doB)
        setMonth(dob.getMonth() + 1)
        setDay(dob.getDate())
        setYear(dob.getFullYear())
      }
      setSex(stats.sex! || 0)
      setHeight(stats.heightImperial || 0)
      setWeight(stats.weightImperial || 0)
      setActivityLevelLabel(stats.activityLevelLabel! || 0)
      setBodyFatPercent(stats.bodyFatPercent || 0)
      if (stats.bodyFatPercent !== 0) {
        setChecked(true)
      }
    }
  }

  const handleGoal = (goal: GoalType) => {
    if (!goal) return
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
      setGoalRateLoseImperial(goal.goalRateLoseImperial!)
      setGoalRateLoseMetric(goal.goalRateLoseMetric!)
      setGoalWeightLoseImperial(goal.goalWeightLoseImperial!)
      setGoalWeightLoseMetric(goal.goalWeightLoseMetric!)
      setGoalRateGainImperial(goal.goalRateGainImperial!)
      setGoalRateGainMetric(goal.goalRateGainMetric!)
      setGoalWeightGainImperial(goal.goalWeightGainImperial!)
      setGoalWeightGainMetric(goal.goalWeightGainMetric!)
      setGoalDate(goal.goalDate!)
      unit === 'imperial'
        ? goal.goalSelection === 'lose'
          ? (setGoalWeight(goal.goalWeightLoseImperial!),
            setGoalRate(goal.goalRateLoseImperial!))
          : (setGoalWeight(goal.goalWeightGainImperial!),
            setGoalRate(goal.goalRateGainImperial!))
        : goal.goalSelection === 'lose'
          ? (setGoalWeight(goalWeightLoseMetric),
            setGoalRate(goalRateLoseMetric))
          : (setGoalWeight(goalWeightGainMetric),
            setGoalRate(goalRateGainMetric))
    }
  }

  // NEEDED?
  useEffect(() => {
    handleBlurGoalRate()
  }, [goalRate])

  // Load user information if data is in db
  useEffect(() => {
    if (!user) return

    const stats =
      user.stats && user.stats.length > 0
        ? user.stats[user.stats.length - 1]
        : undefined
    const goal =
      user.goal && user.goal.length > 0
        ? user.goal[user.goal.length - 1]
        : undefined

    handleStats(stats)
    handleGoal(goal)
  }, [user])

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

  //  Up to 1% of bodyweight per week
  //  10%-20% (20% MAX) above maintenance calories.
  //  0.5lb - 1lb / week
  //  POST CUT - 0.5% for 2 months after

  function getElements(input: string, text: string) {
    if (input === 'weightInput') {
      const weightInput = document.getElementById(
        'lose-weight-input'
      ) as HTMLInputElement

      if (weightInput) {
        weightInput.setCustomValidity(text)
        weightInput.reportValidity()
      }
    } else if (input === 'rateInput') {
      const rateInput = document.getElementById(
        'lose-rate-input'
      ) as HTMLInputElement

      if (rateInput) {
        rateInput.setCustomValidity(text)
        rateInput.reportValidity()
      }
    }
  }

  if (isUserLoading) {
    return <div>Loading...</div>
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
                <label className="goal-lose-fat">
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
                          className="goal-picker-calendar"
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
                <label className="goal-gain-muscle">
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
                          className="goal-picker-calendar"
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
                <label className="goal-maintain-weight">
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
          <div className="optional bodyfat-percentage">
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
