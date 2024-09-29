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
  // console.log('stats entry: ', entry)

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
    // console.log(entry)
    return response.json()
  } else {
    throw await response.json()
  }
}
type InteractionType = 'weight' | 'rate' | 'date' | null

interface InteractionData {
  goalDate: string | null
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
  // const [activityLevel, setActivityLevel] = useState(1.2) // get rid of?
  const [activityLevelLabel, setActivityLevelLabel] = useState('')
  const [bodyFatPercent, setBodyFatPercent] = useState(0)

  const [checkedGoals, setCheckedGoals] = useState<
    Record<GoalOptionsType, boolean>
  >({
    lose: false,
    gain: false,
    maintain: false,
  })

  const [goalDate, setGoalDate] = useState('')

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
  // const [effectiveWeight, setEffectiveWeight] = useState(0)

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

  const maxRangeLose = weight * 0.01
  const maxRangeGain = 2
  const effectiveLoss = Number(
    (maxRangeLose * (calculateDifferenceInDays(goalDate) / 7)).toFixed(1)
  )

  const effectiveGain = Number(
    (maxRangeGain * (calculateDifferenceInDays(goalDate) / 7)).toFixed(1)
  )

  const minLoseWeight = Number((weight - effectiveLoss).toFixed(1))
  // const maxLoseWeight =
  // const minGainWeight =
  const maxGainWeight = Number((weight + effectiveGain).toFixed(1))
  // console.log('minimum of goal weight: ', minLoseWeight)
  // console.log('range must be ', minLoseWeight + ' - ', minLoseWeight + 0.1)

  // useEffect(() => {
  //   setEffectiveWeight(minLoseWeight)
  //   console.log(activityLevel)
  //   console.log('Weight:', weight)
  //   console.log('Max Range:', maxRange)
  //   console.log('Effective Loss:', effectiveLoss)
  //   console.log('Min Lose Weight:', minLoseWeight)
  //   console.log('Effective Lose Weight:', effectiveWeight)
  //   console.log('Display Goal Weight: ', displayGoalWeightValue)
  // }, [weight, maxRange, goalRate])

  const convertWeightToImperial = (kg: number) => kg / 0.45359237
  const convertWeightToMetric = (lbs: number) => lbs * 0.45359237
  const convertHeightToImperial = (cm: number) => cm * 0.3937007874
  const convertHeightToMetric = (inch: number) => inch / 0.3937007874

  //////////
  // Display
  //////////
  const displayHeightValue = Math.round(height * 100) / 100

  const displayWeightValue = Math.round(weight * 10) / 10

  const displayLoseWeightValue =
    unit === 'imperial'
      ? lastFocusedInput === 'lose' ||
        lastFocusedInput === 'goalWeightLose' ||
        goalInfo.goalSelection === 'lose'
        ? goalWeightLoseImperial
        : goalWeightGainImperial
      : lastFocusedInput === 'gain' ||
          lastFocusedInput === 'goalWeightGain' ||
          goalInfo.goalSelection === 'gain'
        ? goalWeightLoseMetric
        : goalWeightGainMetric

  const displayGainWeightValue = Number(goalWeight.toFixed(1))

  // Maybe we do it this way instead of above methods
  const displayGoalRate =
    unit === 'imperial'
      ? lastFocusedInput === 'lose' ||
        lastFocusedInput === 'goalWeightLose' ||
        goalInfo.goalSelection === 'lose'
        ? goalRateLoseImperial
        : goalRateGainImperial
      : lastFocusedInput === 'gain' ||
          lastFocusedInput === 'goalWeightGain' ||
          goalInfo.goalSelection === 'gain'
        ? goalRateLoseMetric
        : goalRateGainMetric

  /////////
  // Toggle
  /////////
  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric'

      // setGoalInfo((prev) => {
      //   const newGoalWeightLoseMetric =
      //     newUnit === 'metric'
      //       ? prev.goalWeightMetric!
      //       : prev.goalWeight!

      //   const newGoalWeightLoseImperial =
      //     newUnit === 'metric'
      //       ? prev.goalWeight!
      //       : convertWeightToImperial(prev.goalWeight!)

      //       const newGoalWeightGainMetric =
      //     newUnit === 'metric'
      //       ? prev.goalWeightMetric!
      //       : prev.goalWeight!

      //   const newGoalWeightGainImperial =
      //     newUnit === 'metric'
      //       ? prev.goalWeight!
      //       : convertWeightToImperial(prev.goalWeight!)

      //   const newGoalRateLoseMetric =
      //     newUnit === 'metric'
      //       ? convertWeightToMetric(prev.goalRate!)
      //       : prev.goalRate!

      //   const newGoalRateLoseImperial =
      //     newUnit === 'metric'
      //       ? prev.goalRate!
      //       : convertWeightToImperial(prev.goalRate!)

      //       const newGoalRateGainMetric =
      //       newUnit === 'metric'
      //         ? convertWeightToMetric(prev.goalRate!)
      //         : prev.goalRate!

      //     const newGoalRateGainImperial =
      //       newUnit === 'metric'
      //         ? prev.goalRate!
      //         : convertWeightToImperial(prev.goalRate!)

      // console.log(newGoalWeightMetric, newGoalWeightImperial)

      //   setGoalRate(
      //     newUnit === 'metric' ? newGoalRateMetric : newGoalRateImperial
      //   )

      //   setGoalWeight(
      //     newUnit === 'metric' ? newGoalWeightMetric : newGoalWeightImperial
      //   )
      //   return {
      //     ...prev,
      //     goalWeight:
      //       newUnit === 'metric' ? newGoalWeightMetric : newGoalWeightImperial,
      //   }
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
  // function isValidDate(date: any): boolean {
  //   return date instanceof Date && !isNaN(date.getTime())
  //   // THESE GO OUTSIDE THIS FUNCTION, JUST FOR NEATNESS/FOLDING
  //   // Makes sure generated Age dates are valid
  //   // const isValidDate = (date: Date) => {
  //   //   return date instanceof Date && !isNaN(date.getTime())
  //   // }

  const isValidWeight = (): boolean => {
    if (goalInfo.goalSelection === 'lose') {
      const tempBmi =
        goalWeightLoseMetric / Math.pow(statsInfo.heightMetric / 100, 2)
      setBmi(tempBmi)
      // console.log(bmi)
      if (tempBmi < 18.5) {
        // MAY NOT NEED STATE VARIABLE HERE...
        console.log(tempBmi)
        console.log(bmi)
        const minimumAllowedWeight =
          18.5 * Math.pow(statsInfo.heightMetric / 100, 2)

        // Needs an error message to pop up and tell them that would be unhealthy
        unit === 'imperial'
          ? (setGoalWeightLoseImperial(
              Number(convertWeightToImperial(minimumAllowedWeight).toFixed(1))
            ),
            setGoalWeight(
              Number(convertWeightToImperial(minimumAllowedWeight).toFixed(1))
            ))
          : (setGoalWeightLoseMetric(
              convertWeightToMetric(Number(minimumAllowedWeight.toFixed(1)))
            ),
            setGoalWeight(Number(minimumAllowedWeight.toFixed(1))))
      }
      return false
    } else if (goalWeight > weight) {
      setGoalWeight(Number(weight.toFixed(1)))
      setGoalWeightLoseImperial(Number(weight.toFixed(1)))
      setGoalWeightLoseMetric(Number(weight.toFixed(1)))
      return false
    }

    console.log('true')
    return true
    // return goalWeight
  }

  ///////////
  // Handlers
  ///////////
  const handleCheckboxChange = (goal: GoalOptionsType) => {
    let goalValue = 0
    if (goal === 'lose') {
      goalValue = unit === 'metric' ? goalRateLoseMetric : goalRateLoseImperial
    } else if (goal === 'gain') {
      goalValue = unit === 'metric' ? goalRateGainMetric : goalRateGainImperial
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
    // console.log('name: ', name)
    // console.log('value: ', value)
    // console.log('numeric value: ', numericValue)

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
        updateGoal(undefined, goalRate)
        if (unit === 'imperial') {
          // Set Imperial Measurements
          setGoalRateLoseImperial(numericValue)
          setGoalRateLoseMetric(convertWeightToMetric(numericValue))
          // setGoalWeightLoseImperial(
          //   calculateGoalWeightFromRateAndDate(name, numericValue)
          // )
          // setGoalWeightLoseMetric(
          //   convertWeightToMetric(
          //     calculateGoalWeightFromRateAndDate(name, numericValue)
          //   )
          // )
          // setGoalInfo((prevGoal) => ({
          //   ...prevGoal,
          //   goalSelection: name,
          //   goalRateLoseImperial: numericValue,
          //   goalRateLoseMetric: convertWeightToMetric(numericValue),
          //   goalWeightLoseImperial: calculateGoalWeightFromRateAndDate(
          //     name,
          //     numericValue
          //   ),
          //   goalWeightLoseMetric: convertWeightToMetric(
          //     calculateGoalWeightFromRateAndDate(name, numericValue)
          //   ),
          // }))
        } else {
          // Set Metric Measurements
          setGoalRateLoseImperial(convertWeightToImperial(numericValue))
          setGoalRateLoseMetric(numericValue)
          // setGoalWeightLoseImperial(
          //   convertWeightToImperial(
          //     calculateGoalWeightFromRateAndDate(name, numericValue)
          //   )
          // )
          // setGoalWeightLoseMetric(
          //   calculateGoalWeightFromRateAndDate(name, numericValue)
          // )
          // // Set GoalInfo Metric-based
          // setGoalInfo((prevGoal) => ({
          //   ...prevGoal,
          //   goalSelection: name,
          //   goalRateLoseImperial: convertWeightToImperial(numericValue),
          //   goalRateLoseMetric: numericValue,
          //   goalWeightLoseImperial: convertWeightToImperial(
          //     calculateGoalWeightFromRateAndDate(name, numericValue)
          //   ),
          //   goalWeightLoseMetric: calculateGoalWeightFromRateAndDate(
          //     name,
          //     numericValue
          //   ),
          // }))
        }
        setGoalRate(numericValue)
        // setGoalWeight(calculateGoalWeightFromRateAndDate(name, numericValue))

        setLastFocusedInput('lose')
        // handleBlurGoalRate()
        break

      // need to update gain and goalWeightGain
      case 'gain':
        // Rate
        // setGoalRateGainMetric(numericValue)
        // setGoalRateGainImperial(numericValue)
        // setGoalRate(numericValue)
        // // User
        // setGoalInfo((prevGoal) => ({
        //   ...prevGoal,
        //   goalSelection: name,
        //   goalRate: numericValue,
        // }))
        // Weight
        // setGoalWeight(
        //   unit === 'metric'
        //     ? calculateGoalWeight(name, numericValue)
        //     : convertWeightToImperial(calculateGoalWeight(name, numericValue))
        // )
        // unit === 'imperial'
        //   ? setGoalWeightGainImperial(calculateGoalWeight(name, numericValue))
        //   : setGoalWeightGainMetric(calculateGoalWeight(name, numericValue))

        unit === 'imperial'
          ? // Set Imperial Measurements
            // Set Goal Rate Imperial-based
            (setGoalRateGainImperial(numericValue),
            setGoalRateGainMetric(convertWeightToMetric(numericValue)),
            // Set Goal Weight Imperial-based
            setGoalWeightGainImperial(
              calculateGoalWeightFromRateAndDate(name, numericValue)
            ),
            setGoalWeightGainMetric(
              convertWeightToMetric(
                calculateGoalWeightFromRateAndDate(name, numericValue)
              )
            ),
            // Set GoalInfo Imperial-based
            setGoalInfo((prevGoal) => ({
              ...prevGoal,
              goalSelection: name,
              goalRateGainImperial: numericValue,
              goalRateGainMetric: convertWeightToMetric(numericValue),
              goalWeightGainImperial: calculateGoalWeightFromRateAndDate(
                name,
                numericValue
              ),
              goalWeightGainMetric: convertWeightToMetric(
                calculateGoalWeightFromRateAndDate(name, numericValue)
              ),
            })))
          : // Set Metric Measurements
            // Set Goal Rate Metric-based
            (setGoalRateGainImperial(convertWeightToImperial(numericValue)),
            setGoalRateGainMetric(numericValue),
            // Set Goal Weight Metric-based
            setGoalWeightGainImperial(
              convertWeightToImperial(
                calculateGoalWeightFromRateAndDate(name, numericValue)
              )
            ),
            setGoalWeightGainMetric(
              calculateGoalWeightFromRateAndDate(name, numericValue)
            ),
            // Set GoalInfo Metric-based
            setGoalInfo((prevGoal) => ({
              ...prevGoal,
              goalSelection: name,
              goalRateGainImperial: convertWeightToImperial(numericValue),
              goalRateGainMetric: numericValue,
              goalWeightGainImperial: convertWeightToImperial(
                calculateGoalWeightFromRateAndDate(name, numericValue)
              ),
              goalWeightGainMetric: calculateGoalWeightFromRateAndDate(
                name,
                numericValue
              ),
            })))

        setGoalRate(numericValue)
        setGoalWeight(calculateGoalWeightFromRateAndDate(name, numericValue))

        // User
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalSelection: name,
          // goalRateLose: numericValue,
        }))

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
        setGoalWeight(numericValue)
        setGoalRate(calculateGoalRateFromWeightAndDate(numericValue, goalDate))
        setGoalRateGainImperial(
          calculateGoalRateFromWeightAndDate(numericValue, goalDate)
        )
        setGoalRateGainMetric(
          calculateGoalRateFromWeightAndDate(numericValue, goalDate)
        )
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalRate: goalRate,
        }))

        setLastFocusedInput('goalWeightGain')
        break

      default:
        break
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // console.log('statsInfo in submit: ', statsInfo)
    updateDateFromAge(age)

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
  function updateGoal(weight?: number, rate?: number, date?: string) {
    const currentInteraction = interactionData.lastInteraction

    let newInteraction: InteractionType = null

    if (weight !== undefined) {
      interactionData.goalWeight = weight
      newInteraction = 'weight'
    }
    if (rate !== undefined) {
      interactionData.goalRate = rate
      newInteraction = 'rate'
    }
    if (date) {
      //} && isValidDate(date)) {
      interactionData.goalDate = date
      newInteraction = 'date'
    }

    if (newInteraction && newInteraction !== currentInteraction) {
      if (currentInteraction !== newInteraction) {
        interactionData.previousInteraction = currentInteraction
      }
      interactionData.lastInteraction = newInteraction
    }

    if (rate === undefined) {
      interactionData.goalRate = goalRate
    }

    // if (weight === undefined) {
    //   interactionData.goalWeight = goalWeight
    // }

    if (!interactionData.goalDate) {
      interactionData.goalDate = null
    }

    // calculateMissingField()
    // console.log(interactionData)
  }

  const updateWeightFromDate = (goalDate: string) => {
    if (interactionData.previousInteraction === 'rate') {
      const today = new Date()
      if (today) {
        //isValidDate(today)) {
        let differenceInDays = 0
        let totalAmount = 0
        let targetWeight = 0
        console.log('goalWeight: ', goalWeight)

        differenceInDays = calculateWeeksUntilDate(goalDate)
        totalAmount = goalRate * differenceInDays
        targetWeight = weight - totalAmount
        console.log('targetWeight: ', targetWeight)

        // targetWeight =
        // unit === 'metric' ? goalWeight : convertHeightToImperial(goalWeight)

        // SET ONE FOR LOSE AND ONE FOR GAIN
        setGoalWeight(
          unit === 'imperial'
            ? targetWeight
            : convertWeightToMetric(targetWeight)
        )
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
        console.log('not valid')
      }
    } else if (interactionData.previousInteraction === 'weight') {
      // update rate
      setGoalRate(calculateGoalRateFromWeightAndDate(goalWeight, goalDate))
      console.log(goalRate)
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
          setGoalRateGainMetric(
            Number(
              calculateGoalRateFromWeightAndDate(goalWeight, goalDate).toFixed(
                1
              )
            )
          )
        }
      }
    }
  }

  // Calculations
  const calculateGoalWeightFromRateAndDate = (
    goal: string,
    goalRate: number
  ): number => {
    // console.log('weight: ', weight, 'goalRate: ', goalRate)
    if (goalDate && goalRate !== 0) {
      const parseGoalDate = new Date(goalDate)
      const weeksToTargetDate = calculateWeeksUntilDate(
        parseGoalDate.toISOString()
      )
      const rate = goalRate

      const targetWeight =
        goal === 'lose'
          ? Number((weight - weeksToTargetDate * rate).toFixed(1))
          : Number((weight + weeksToTargetDate * rate).toFixed(1))

      // console.log(
      //   'targetWeight: ',
      //   targetWeight,
      //   'weeksToTargetDate: ',
      //   weeksToTargetDate
      // )
      setGoalWeight(targetWeight)

      // setGoalInfo((prev) => ({
      //   ...prev,
      //   goalWeight: targetWeight,
      // }))

      return targetWeight
    }
    return 0
  }

  // Need to finish putting error message in here. Clean it up
  const calculateGoalRateFromWeightAndDate = (
    goalWeight: number,
    goalDate: string
  ): number => {
    if (goalDate && goalWeight > 0) {
      //isValidDate(goalDate) && goalWeight > 0) {
      const differenceInDays = calculateDifferenceInDays(goalDate)

      // if (differenceInDays >= 0) {
      //   let tempGoalRate = 0
      //   if (goalInfo.goalSelection === 'lose') {
      //     tempGoalRate = (weight - goalWeight) / (differenceInDays / 7)
      //     // Put good error message in like window that says you have to have a name

      //     // if (tempGoalRate <= weight * 0.01) {
      //     //   return tempGoalRate
      //     // } else {
      //     //   console.log(tempGoalRate)

      //     //   //   const rateInput = document.querySelector('input[name="rate-input"]')
      //     //   //   const weightInput = document.getElementById('weight-input')
      //     //   //  rateInput?.addEventListener("invalid", function (event) {
      //     //   //   if (event.target.value === 0) {

      //     //   //   }
      //     //   //  })

      //     //   setErrorMessage(
      //     //     'too low'
      //     //     // 'You need more time to lose that amount of weight in a healthy manner.'
      //     //   )
      //     //   return 0
      //     // }
      //   }
      const weightInput = document.getElementById(
        'lose-weight-input'
      ) as HTMLInputElement
      weightInput.setCustomValidity('')

      if (differenceInDays >= 0) {
        let tempGoalRate = 0
        if (goalInfo.goalSelection === 'lose') {
          tempGoalRate = (weight - goalWeight) / (differenceInDays / 7)

          console.log(
            'Before:',
            weightInput.validity.valid,
            weightInput.validity.rangeUnderflow
          )
          if (tempGoalRate <= weight * 0.01 && tempGoalRate > 0) {
            return tempGoalRate
          } else {
            weightInput.setCustomValidity(
              'Goal weight is too low based on the rate and date.'
            )
            console.log(
              'After:',
              weightInput.validity.valid,
              weightInput.validity.rangeUnderflow
            )
            weightInput.reportValidity()
            setTimeout(() => {
              weightInput.focus()
              console.log(
                'Focused on weight input:',
                document.activeElement === weightInput
              )
            }, 0)

            return 0
          }
        }

        if (goalInfo.goalSelection === 'gain') {
          tempGoalRate = (goalWeight - weight) / (differenceInDays / 7)
          if (tempGoalRate <= 2) {
            return tempGoalRate
          }
        }
        return 0
      } else {
        // Put good error message in like window that says you have to have a name
        throw new Error('The goal date must be in the future.')
      }
    }
    return goalRate
  }

  const weightInput = document.getElementById(
    'lose-weight-input'
  ) as HTMLInputElement
  weightInput?.addEventListener('blur', () => {
    if (interactionData.previousInteraction !== null) {
      weightInput.reportValidity()
    }
  })

  function handleBlurGoalWeight() {
    // setGoalWeight(isValidWeight())
    const isValid = isValidWeight()

    // update Date based on GoalWeight and GoalRate
    // Last box that had input was goal RATE
    if (
      isValid &&
      (interactionData.previousInteraction === 'rate' ||
        interactionData.previousInteraction === null) &&
      goalRate !== 0
    ) {
      calculateGoalDateFromWeightAndRate()
    }
    // Last input given was goal WEIGHT
    // Last input given was goal DATE
    updateGoal(goalWeight)
    calculateGoalDateFromWeightAndRate()
    // if (goalDate) {
    //   //isValidDate(goalDate)) {
    //   // console.log('goalRate: ', goalRate)
    //   if (goalRate !== 0) {
    //     const today = new Date()
    //     const daysToTargetWeight = ((weight - goalWeight) * 7) / goalRate
    //     // const newDate = new Date(goalDate)
    //     const targetDate = new Date(
    //       today.setDate(today.getDate() + daysToTargetWeight)
    //     )

    //     // console.log('today: ', today)
    //     // console.log('goalDate: ', goalDate)
    //     // console.log('daysToTargetWeight: ', daysToTargetWeight)
    //     // console.log('newDate: ', newDate)
    //     // console.log('targetDate: ', targetDate)
    //     // console.log('targetDate: ', targetDate.toISOString())

    //     setGoalDate(targetDate.toISOString())
    //     setStatsInfo((prev) => ({
    //       ...prev,
    //       goalWeight: goalWeight,
    //       goalRate: goalRate,
    //       goalDate: targetDate.toISOString(),
    //     }))

    //     setGoalInfo((prev) => ({
    //       ...prev,
    //       // goalWeight: goalWeight,
    //       // goalRate: goalRate,
    //       goalDate: targetDate.toISOString(),
    //     }))
    //   }
    // }
  }

  const calculateGoalDateFromWeightAndRate = () => {
    //isValidDate(goalDate)) {
    if (goalRate !== 0) {
      const today = new Date()
      const daysToTargetWeight = ((weight - goalWeight) * 7) / goalRate
      const targetDate = new Date(
        today.setDate(today.getDate() + daysToTargetWeight)
      )
      // console.log(goalRate, targetDate)

      setGoalDate(targetDate.toISOString())
      setStatsInfo((prev) => ({
        ...prev,
        goalDate: targetDate.toISOString(),
      }))

      setGoalInfo((prev) => ({
        ...prev,
        goalDate: targetDate.toISOString(),
      }))
    }
  }

  const calculateWeeksUntilDate = (goalDate: string): number => {
    const today = new Date().toISOString()
    if (goalDate) {
      //isValidDate(goalDate)) {
      if (goalDate > today) {
        const differenceInDays = calculateDifferenceInDays(goalDate)
        const differenceInWeeks = differenceInDays / 7

        return differenceInWeeks
      }
    }

    return 0
  }

  function calculateDifferenceInDays(goalDate: string): number {
    const newDate = new Date(goalDate)
    if (goalDate) {
      //isValidDate(goalDate)) {
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

  // Blurs
  function handleBlurGoalDate() {
    // WRONG FUNCTION!! OOPS NEEDS TO BE IN GOALWEIGHTBLUR
    // update Date based on GW and GR
    if (goalDate) {
      //isValidDate(goalDate)) {
      // console.log('focusedField: ', focusedField)

      // Last box that had input was goal RATE
      if (lastFocusedInput === 'lose') {
        const daysToTargetWeight = calculateDifferenceInDays(goalDate)
        const weeksToTargetWeight = daysToTargetWeight / 7
        const targetWeight = weight - goalRate * weeksToTargetWeight
        console.log('targetWeight: ', targetWeight)
        setGoalWeight(targetWeight)
        if (unit === 'metric') {
          //////////////////
          //////////////
          ///////////

          setGoalInfo((prev) => ({
            ...prev,
            goalRateLoseMetric: goalRate,
            goalRateGainMetric: goalRate,
            goalWeightLoseMetric: targetWeight,
            goalWeightGainMetric: targetWeight,
            goalRateLoseImperial: convertWeightToImperial(goalRate),
            goalRateGainImperial: convertWeightToImperial(goalRate),
            goalWeightLoseImperial: convertWeightToImperial(targetWeight),
            goalWeightGainImperial: convertWeightToImperial(targetWeight),
          }))
        } else {
          setGoalInfo((prev) => ({
            ...prev,
            goalRateLoseMetric: convertWeightToMetric(goalRate),
            goalRateGainMetric: convertWeightToMetric(goalRate),
            goalWeightLoseMetric: convertWeightToMetric(targetWeight),
            goalWeightGainMetric: convertWeightToMetric(targetWeight),
            goalRateLoseImperial: goalRate,
            goalRateGainImperial: goalRate,
            goalWeightLoseImperial: targetWeight,
            goalWeightGainImperial: targetWeight,
          }))
        }

        // Last input given was goal WEIGHT
      } else if (lastFocusedInput === 'goalWeightLose') {
        let differenceInDays = 0
        let totalAmount = 0
        let targetWeight = 0

        if (goalWeight === 0) {
          differenceInDays = calculateWeeksUntilDate(goalDate)
          totalAmount = goalRate * differenceInDays
          targetWeight = weight - totalAmount
          console.log('targetWeight: ', targetWeight)
        } else {
          targetWeight = goalWeight
        }

        setGoalWeight(
          unit === 'metric'
            ? targetWeight
            : convertWeightToImperial(targetWeight)
        )
        setGoalInfo((prev) => ({
          ...prev,
          goalWeight: targetWeight,
        }))
      }
      // if (
      //   interactionData.previousInteraction === 'weight' ||
      //   interactionData.previousInteraction === null
      // ) {
      //   calculateGoalRateFromWeightAndDate(goalWeight, goalDate)
      // }
      // Last input given was goal DATE
      // else if (lastFocusedInput == 'goalDateLose') {
      //   // need stuff
      // }
    }
    // console.log('focusedField: ', focusedField)
  }

  function handleBlurGoalRate() {
    if (
      (interactionData.previousInteraction === 'date' ||
        interactionData.previousInteraction === null) &&
      goalRate >= 0
    ) {
      if (unit === 'imperial') {
        // Set Imperial Measurements
        setGoalWeightLoseImperial(
          calculateGoalWeightFromRateAndDate(goalInfo.goalSelection!, goalRate)
        )
        setGoalWeightLoseMetric(
          convertWeightToMetric(
            calculateGoalWeightFromRateAndDate(
              goalInfo.goalSelection!,
              goalRate
            )
          )
        )
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalSelection: goalInfo.goalSelection!,
          goalRateLoseImperial: goalRate,
          goalRateLoseMetric: convertWeightToMetric(
            calculateGoalWeightFromRateAndDate(
              goalInfo.goalSelection!,
              goalRate
            )
          ),
          goalWeightLoseImperial: calculateGoalWeightFromRateAndDate(
            goalInfo.goalSelection!,
            goalRate
          ),
          goalWeightLoseMetric: convertWeightToMetric(
            calculateGoalWeightFromRateAndDate(
              goalInfo.goalSelection!,
              goalRate
            )
          ),
        }))
      } else {
        // Set Metric Measurements
        setGoalWeightLoseImperial(
          convertWeightToImperial(
            calculateGoalWeightFromRateAndDate(
              goalInfo.goalSelection!,
              goalRate
            )
          )
        )
        setGoalWeightLoseMetric(
          calculateGoalWeightFromRateAndDate(goalInfo.goalSelection!, goalRate)
        )
        setGoalInfo((prevGoal) => ({
          ...prevGoal,
          goalSelection: goalInfo.goalSelection!,
          goalRateLoseImperial: convertWeightToImperial(goalRate),
          goalRateLoseMetric: goalRate,
          goalWeightLoseImperial: convertWeightToImperial(
            calculateGoalWeightFromRateAndDate(
              goalInfo.goalSelection!,
              goalRate
            )
          ),
          goalWeightLoseMetric: calculateGoalWeightFromRateAndDate(
            goalInfo.goalSelection!,
            goalRate
          ),
        }))

        setGoalWeight(
          calculateGoalWeightFromRateAndDate(goalInfo.goalSelection!, goalRate)
        )
      }
    } else if (
      interactionData.previousInteraction === 'weight' &&
      goalRate >= 0
    ) {
      calculateGoalDateFromWeightAndRate()
    } else {
      console.warn('Attempted to set a negative goal rate:', goalRate)
    }
  }

  //handleblurgoalweight goes here

  function handleBlurDob() {
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

  // useEffect(() => {
  //   const calculateGoalWeight = (goalRate: number): number => {
  //     if (goalDate) {
  //       const parseGoalDate = new Date(goalDate)
  //       const weeksToTargetDate = calculateGoalRateFromDate(parseGoalDate)
  //       const rate = goalRate

  //       const targetWeight =
  //         goalInfo.goalSelection === 'lose'
  //           ? Number((weight - weeksToTargetDate * rate).toFixed(1))
  //           : Number((weight + weeksToTargetDate * rate).toFixed(1))

  //       console.log('goalSelection: ', goalInfo.goalSelection)
  //       console.log('targetWeight: ', targetWeight)

  //       goalInfo.goalSelection === 'lose'
  //         ? setGoalWeightLose(targetWeight)
  //         : setGoalWeightGain(targetWeight)

  //       setGoalWeight(targetWeight)

  //       setGoalInfo((prev) => ({
  //         ...prev,
  //         goalWeight: targetWeight,
  //       }))
  //       // console.log('goalDate: ', goalDate)
  //       // console.log('rate: ', rate)
  //       // console.log('weeksToTargetDate: ', weeksToTargetDate)

  //       return targetWeight
  //     }
  //     return 0
  //   }
  //   calculateGoalWeight(goalRate)
  // }, [goalInfo.goalSelection])

  //  Up to 1% of bodyweight per week
  //  10%-20% (20% MAX) above maintenance calories.
  //  0.5lb - 1lb / week
  //  POST CUT - 0.5% for 2 months after

  // Need one for lose and one for gain or handles both

  const calculateAge = (dob: Date): number => {
    const today = new Date()
    if (today && dob) {
      //isValidDate(today) && isValidDate(dob)) {
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

    if (userDob) {
      //isValidDate(userDob)) {
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

    if (today) {
      //isValidDate(today)) {
      const age = today.getFullYear() - dob.getFullYear()

      setAge(age)
    }
  }

  // Handlers to update focus state
  const handleFocus = (field: string) => {
    setFocusedField(field)
  }

  ///////////////////////////////////////////////////////////

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

  // const validateGoalWeight = (weight: number) => {
  //   // const bmi = weight! / Math.pow(heightMetric! / 100, 2)
  //   // setBmi(bmi)
  //   // if (bmi )
  //   if (weight <= 0 || weight > weight * 0.75) {
  //     throw new Error(`Goal weight must be between 1 and ${weight * 0.75} lbs.`)
  //   }
  //   setGoalWeight(weight)
  // }

  // Handle mouse clicks outside Age, Month, Day, Year, DoB date

  // Get user and load data if data is in db

  useEffect(() => {
    handleBlurGoalRate()
  }, [goalRate])

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
        // console.log(user)
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
            // console.log(user)
            setGoalInfo({
              ...goal,
              userId: user.id,
            })

            setCheckedGoals({
              lose: goal.goalSelection === 'lose',
              gain: goal.goalSelection === 'gain',
              maintain: goal.goalSelection === 'maintain',
            })

            // if (goal.goalSelection === 'imperial') {
            //   if (goal.goalWeightLoseImperial <= stats.weightImperial) {
            //     setGoalWeightLoseImperial(goal.goalWeightImperial)
            //     setGoalWeightLoseMetric(goal.goalWeightLoseMetric)
            //   } else if (goal.goalWeightGainImperial > stats.weightImperial) {
            //     setGoalWeightGainImperial(goal.goalWeightImperial)
            //     setGoalWeightGainMetric(goal.goalWeightGainMetric)
            //   }
            // }

            // if (unit === 'imperial') {
            //   if (goal.goalSelection === 'lose') {
            //     setGoalRate(goal.goalRateLoseImperial)
            //     setGoalWeight(goal.goalWeightLoseImperial)
            //   } else {
            //     setGoalRate(goal.goalRateGainImperial)
            //     setGoalWeight(goal.goalWeightGainImperial)
            //   }
            // }

            unit === 'imperial'
              ? goal.goalSelection === 'lose'
                ? (setGoalRate(goal.goalRateLoseImperial),
                  setGoalWeight(goal.goalWeightLoseImperial))
                : (setGoalRate(goal.goalRateGainImperial),
                  setGoalWeight(goal.goalWeightGainImperial))
              : goal.goalSelection === 'lose'
                ? (setGoalRate(goal.goalRateLoseMetric),
                  setGoalWeight(goal.goalWeightLoseMetric))
                : (setGoalRate(goal.goalRateGainMetric),
                  setGoalWeight(goal.goalWeightGainMetric))

            // if (goal.goalSelection === 'lose') {
            setGoalRateLoseMetric(goal.goalRateLoseMetric)
            setGoalRateLoseImperial(goal.goalRateLoseImperial)
            setGoalWeightLoseMetric(goal.goalWeightLoseMetric)
            setGoalWeightLoseImperial(goal.goalWeightLoseImperial)
            // } else if (goal.goalSelection === 'gain') {
            setGoalRateGainMetric(goal.goalRateGainMetric)
            setGoalRateGainImperial(goal.goalRateGainImperial)
            setGoalWeightGainMetric(goal.goalWeightGainMetric)
            setGoalWeightGainImperial(goal.goalWeightGainImperial)
            // }
            setGoalDate(goal.goalDate)
            // setBodyFatPercent(goal.bodyFatPercent)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

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
                onBlur={handleBlurGoalWeight}
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
                    id="rate-input"
                    className="goal-rate"
                    type="number"
                    name="lose"
                    placeholder="lbs per week"
                    value={displayGoalRate}
                    // value={goalRateLose}
                    onChange={handleInputChange}
                    onBlur={handleBlurGoalRate}
                    required
                  />
                  {unit === 'imperial' ? 'lbs' : 'kg'}
                  <div className="date-picker-goal">
                    {/* Is janky, needs fixing. it re-renders upon clicking date */}
                    <input
                      id="lose-weight-input"
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
                      required
                    />
                    {unit === 'imperial' ? 'lbs' : 'kg'}
                    <DatePicker
                      className="date-picker-calendar"
                      selected={new Date(goalDate)}
                      onChange={(date, event) => {
                        event?.preventDefault()
                        updateGoal(undefined, undefined, date?.toISOString())
                        if (date) {
                          setGoalDate(date.toISOString())
                          updateWeightFromDate(date.toISOString())
                          setGoalInfo((prev) => ({
                            ...prev,
                            // goalWeight: prev.goalWeight,
                            goalDate: date.toISOString(),
                          }))
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
                    value={
                      unit === 'metric'
                        ? goalRateLoseMetric
                        : goalRateLoseImperial
                    }
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
                    // value={goalRateGain}
                    value={displayGoalRate}
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
                      selected={new Date(goalDate)}
                      onChange={(date, event) => {
                        event?.preventDefault()
                        if (date) {
                          setGoalDate(date.toISOString())
                          updateWeightFromDate(date.toISOString())
                          setGoalInfo((prev) => ({
                            ...prev,
                            // goalWeight: prev.goalWeight,
                            goalDate: date.toISOString(),
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
                    value={
                      unit === 'metric'
                        ? goalRateGainMetric
                        : goalRateGainImperial
                    }
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="gain-placeholder">
                  <p>Up to 2 lbs/1 kg per week</p>
                </div>
              )}
              {/* {checkedGoals.gain ? (
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
                       onChange={(date, event) => {
                        event?.preventDefault()
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
                    Up to 2 lbs/1 kg per week
                    {/* Up to 1% of bodyweight per week
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

export default UserInfo

// function handleBlurGoalWeight() {
//   // setGoalWeight(isValidWeight())

//   // update Date based on GW and GR
//   // Last box that had input was goal RATE
//   // Last input given was goal WEIGHT
//   // Last input given was goal DATE

//   updateGoal(goalWeight)

//   // if last and prev are weight/weight, rate/rate, weight/rate, rate/weight or null

//   if (
//     (interactionData.lastInteraction === 'weight' &&
//       interactionData.previousInteraction === 'weight') ||
//     (interactionData.lastInteraction === 'rate' &&
//       interactionData.previousInteraction === 'rate') ||
//     (interactionData.lastInteraction === 'rate' &&
//       interactionData.previousInteraction === 'weight') ||
//     (interactionData.lastInteraction === 'weight' &&
//       interactionData.previousInteraction === 'rate') ||
//     interactionData.previousInteraction === null
//   ) {
//     if (interactionData.goalRate !== null) {
//       // Calculate date from rate and weight
//       console.log('1')
//       const today = new Date()
//       if (isValidDate(goalDate)) {
//         console.log('2')
//         if (goalRate !== 0) {
//           const daysToTargetWeight = ((weight - goalWeight) * 7) / goalRate
//           const newDate = new Date(today)
//           const targetDate = new Date(
//             newDate.setDate(today.getDate() + daysToTargetWeight)
//           )

//           console.log('today: ', today)
//           console.log('goalDate: ', goalDate)
//           console.log('daysToTargetWeight: ', daysToTargetWeight)
//           console.log('newDate: ', newDate)
//           console.log('targetDate: ', targetDate)

//           setGoalDate(targetDate)
//           setStatsInfo((prev) => ({
//             ...prev,
//             goalWeight: goalWeight,
//             goalRate: goalRate,
//             goalDate: targetDate,
//           }))
//         }
//       }
//     }
//   }
//   // Looks at Date and Rate to determine Weight?
//   else if (
//     goalDate &&
//     (interactionData.lastInteraction ||
//       interactionData.previousInteraction === 'date')
//   ) {
//     console.log('3')
//     const today = new Date()
//     if (isValidDate(goalDate)) {
//       console.log('4')

//       if (goalRate !== 0) {
//         const daysToTargetWeight = ((weight - goalWeight) * 7) / goalRate
//         const newDate = new Date(today)
//         const targetDate = new Date(
//           newDate.setDate(today.getDate() + daysToTargetWeight)
//         )

//         console.log('today: ', today)
//         console.log('goalDate: ', goalDate)
//         console.log('daysToTargetWeight: ', daysToTargetWeight)
//         console.log('newDate: ', newDate)
//         console.log('targetDate: ', targetDate)

//         setGoalDate(targetDate)
//         setStatsInfo((prev) => ({
//           ...prev,
//           goalWeight: goalWeight,
//           goalRate: goalRate,
//           goalDate: targetDate,
//         }))
//       }
//     }
//   }
// }
