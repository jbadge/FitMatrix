import React, { useEffect, useState } from 'react'
import { APIError, ProgressType } from '../types/types'
import { authHeader } from '../types/auth'
import { useNavigate, useParams } from 'react-router'
import { useMutation } from 'react-query'
import DatePicker from 'react-datepicker'
import { getMonth, getYear } from 'date-fns'

// import StepCounter from '../components/StepCounter'

async function submitProgress(entry: ProgressType) {
  const id = entry.userId
  console.log('id: ', entry.id)

  const response = await fetch(`/api/Users/${id}/Progress`, {
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

async function updateProgress(entry: ProgressType) {
  console.log(entry)
  const id = entry.id
  const response = await fetch(`/api/Users/${entry.userId}/Progress/${id}`, {
    method: 'PUT',
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

const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

const Progress = () => {
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = React.useState('')

  const [unit, setUnit] = useState('imperial')
  const [calories, setCalories] = useState(0)

  const [progress, setProgress] = useState<ProgressType>({
    userId: 0,
    progressWeightImperial: 0,
    progressWeightMetric: 0,
    calories: 0,
    bodyFatPercent: 0,
  })

  const [weight, setWeight] = useState(0)

  const [dateOfEntry, setDateOfEntry] = useState(new Date())
  const [progressEntries, setProgressEntries] = useState<ProgressType[]>([])

  const years = range(1990, getYear(new Date()) + 1, 1)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const convertWeightToImperial = (kg: number) => kg / 0.45359237
  const convertWeightToMetric = (lbs: number) => lbs * 0.45359237

  const createProgressMutation = useMutation(
    (progress: ProgressType) => submitProgress(progress),
    {
      onSuccess: function () {
        console.log('Progress submitted successfully')
        navigate('/')
      },
      onError: function (apiError: APIError) {
        setErrorMessage(Object.values(apiError.errors).join(' '))
      },
    }
  )

  const displayWeightValue =
    unit === 'imperial'
      ? Math.round(weight * 100) / 100
      : Math.round(weight * 100) / 100

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const chosenDate = new Date(dateOfEntry)
    const loadedProgressDate = new Date(progress.doE!)

    if (chosenDate.toDateString() === loadedProgressDate.toDateString()) {
      console.log('hey')
      try {
        await updateProgress(progress)
        console.log('Entry updated successfully.')
        navigate(`/`)
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    } else {
      delete progress.id
    }
    progress.doE = dateOfEntry

    try {
      await Promise.all([
        (progress.userId = Number(id)),
        createProgressMutation.mutate(progress),
      ])
    } catch (error) {
      console.error('Error submitting progress:', error)
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const value = parseFloat(event.target.value)

    if (progress.userId === 0) {
      setProgress((prev) => ({
        ...prev,
        userId: Number(id),
      }))
    }

    if (name === 'weight') {
      if (unit === 'metric') {
        setWeight(value)
        setProgress((prev) => ({
          ...prev,
          progressWeightMetric: value,
          progressWeightImperial: convertWeightToImperial(value),
          calories: prev.calories,
        }))
      } else if (unit === 'imperial') {
        setWeight(value)
        setProgress((prev) => ({
          ...prev,
          progressWeightMetric: convertWeightToMetric(value),
          progressWeightImperial: value,
          calories: prev.calories,
        }))
      }
    }

    if (name === 'calories') {
      setCalories(value)
      setProgress((prev) => ({
        ...prev,
        progressWeightMetric: prev.progressWeightMetric,
        progressWeightImperial: prev.progressWeightImperial,
        calories: value,
      }))
    }
  }

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric'

      setProgress((prevInput) => {
        const newWeightMetric =
          newUnit === 'metric'
            ? prevInput.progressWeightMetric!
            : convertWeightToMetric(prevInput.progressWeightImperial!)
        const newWeightImperial =
          newUnit === 'imperial'
            ? prevInput.progressWeightImperial!
            : convertWeightToImperial(prevInput.progressWeightMetric!)
        const date = new Date()
        setWeight(newUnit === 'metric' ? newWeightMetric : newWeightImperial)

        return {
          dateOfEntry: date,
          progressWeightMetric: newWeightMetric,
          progressWeightImperial: newWeightImperial,
          calories: calories,
        }
      })
      return newUnit
    })
  }

  useEffect(() => {
    console.log('useEffect, fetching...')
    async function fetchUserData() {
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
        if (!user) return

        let progressEntryArray: ProgressType[] = user.progress || []
        setProgressEntries(progressEntryArray)

        let sortedProgressEntryArray = [...progressEntryArray].sort(
          (a, b) => a.id! - b.id!
        )

        const progressEntry = sortedProgressEntryArray.slice(-1)

        setProgress(progressEntry[0] || {})

        const chosenDate = new Date(dateOfEntry)
        const loadedProgressDate = new Date(progressEntry[0].doE!)

        if (chosenDate.toDateString() === loadedProgressDate.toDateString()) {
          unit === 'imperial'
            ? setWeight(progressEntry[0].progressWeightImperial!)
            : setWeight(progressEntry[0].progressWeightMetric!)
          setCalories(progressEntry[0].calories!)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  return (
    <main className="user-page">
      {/* <StepCounter /> */}
      <h1>FitMatrix</h1>
      <h6>Remember, drink 8 glasses of water a day!</h6>
      <div className="user-container">
        <div className="button-container">
          <button onClick={toggleUnit}>
            Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <div className="date-picker-container">
            <DatePicker
              className="date-picker-calendar"
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="date-picker-header">
                  <button
                    className="date-picker-button"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                  >
                    {'<'}
                  </button>
                  <select
                    className="date-picker-select"
                    value={getYear(date)}
                    onChange={({ target: { value } }) =>
                      changeYear(Number(value))
                    }
                  >
                    {years.map((option: number) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <select
                    className="date-picker-select"
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) =>
                      changeMonth(months.indexOf(value))
                    }
                  >
                    {months.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button
                    className="date-picker-button"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                  >
                    {'>'}
                  </button>
                </div>
              )}
              selected={dateOfEntry}
              onChange={(date) => {
                if (date) {
                  setDateOfEntry(date)
                  const entryForDate = progressEntries.find(
                    (entry) =>
                      entry.doE &&
                      new Date(entry.doE).toDateString() === date.toDateString()
                  )
                  if (entryForDate) {
                    setProgress(entryForDate)
                    unit === 'imperial'
                      ? setWeight(entryForDate.progressWeightImperial!)
                      : setWeight(entryForDate.progressWeightMetric!)
                    setCalories(entryForDate.calories!)
                  } else {
                    setProgress({
                      userId: 0,
                      progressWeightImperial: 0,
                      progressWeightMetric: 0,
                      calories: 0,
                      bodyFatPercent: 0,
                    })
                    setWeight(0)
                    setCalories(0)
                  }
                } else {
                  setDateOfEntry(new Date())
                }
              }}
              dateFormat="MMMM d'th', yyyy"
            />
            <i className="fas fa-edit edit-icon"></i>
          </div>
          <p className="form-input">
            <label htmlFor="weight"></label>
            <input
              type="number"
              className="form-control progress"
              name="weight"
              placeholder="Weight"
              value={displayWeightValue || ''}
              required
              onChange={handleInputChange}
            />
          </p>
          <p className="form-input">
            <label htmlFor="calories">
              <span className="reminder">
                Remember to measure RAW ingredients
              </span>
            </label>
            <input
              type="number"
              className="form-control progress"
              name="calories"
              placeholder="Calories"
              value={calories || ''}
              onChange={handleInputChange}
            />
          </p>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </main>
  )
}

export default Progress
