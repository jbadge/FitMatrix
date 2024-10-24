import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { APIError, MeasurementsType } from '../types/types'
import { authHeader } from '../types/auth'
import { useMutation } from 'react-query'

async function submitMeasurements(entry: MeasurementsType) {
  const id = entry.userId

  const response = await fetch(`/api/Users/${id}/Measurements`, {
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

async function updateMeasurements(entry: MeasurementsType) {
  const id = entry.id

  const response = await fetch(
    `/api/Users/${entry.userId}/Measurements/${id}`,
    {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: authHeader(),
      },
      body: JSON.stringify(entry),
    }
  )

  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

const Measurements = () => {
  const navigate = useNavigate()
  const { id } = useParams() as { id: string }

  const [errorMessage, setErrorMessage] = React.useState('')
  const [unit, setUnit] = useState('imperial')
  const [dateOfEntry, setDateOfEntry] = useState(new Date())

  ///////////////
  // Measurements
  ///////////////
  const [waist, setWaist] = useState(0)
  const [neck, setNeck] = useState(0)
  const [hips, setHips] = useState(0)
  const [forearm, setForearm] = useState(0)
  const [wrist, setWrist] = useState(0)
  const [thigh, setThigh] = useState(0)
  const [calf, setCalf] = useState(0)

  const [measurementsInfo, setMeasurementsInfo] = useState<MeasurementsType>({
    userId: 0,
    waistMetric: 0,
    waistImperial: 0,
    neckMetric: 0,
    neckImperial: 0,
    hipsMetric: 0,
    hipsImperial: 0,
    rightForearmMetric: 0,
    rightForearmImperial: 0,
    rightWristMetric: 0,
    rightWristImperial: 0,
    rightThighMetric: 0,
    rightThighImperial: 0,
    rightCalfMetric: 0,
    rightCalfImperial: 0,
  })

  const convertLengthToImperial = (cm: number) =>
    Math.round(cm * 0.3937007874 * 10) / 10
  const convertLengthToMetric = (inch: number) =>
    Math.round((inch / 0.3937007874) * 10) / 10

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'imperial' ? 'metric' : 'imperial'

      setMeasurementsInfo((prev) => {
        return {
          ...prev,
        }
      })

      setWaist(
        newUnit === 'metric'
          ? measurementsInfo.waistMetric
          : measurementsInfo.waistImperial
      )
      setNeck(
        newUnit === 'metric'
          ? measurementsInfo.neckMetric
          : measurementsInfo.neckImperial
      )
      setHips(
        newUnit === 'metric'
          ? measurementsInfo.hipsMetric
          : measurementsInfo.hipsImperial
      )
      setForearm(
        newUnit === 'metric'
          ? measurementsInfo.rightForearmMetric
          : measurementsInfo.rightForearmImperial
      )
      setWrist(
        newUnit === 'metric'
          ? measurementsInfo.rightWristMetric
          : measurementsInfo.rightWristImperial
      )
      setThigh(
        newUnit === 'metric'
          ? measurementsInfo.rightThighMetric
          : measurementsInfo.rightThighImperial
      )
      setCalf(
        newUnit === 'metric'
          ? measurementsInfo.rightCalfMetric
          : measurementsInfo.rightCalfImperial
      )

      return newUnit
    })
  }

  const createMeasurementsMutation = useMutation(
    (measurementsInfo: MeasurementsType) =>
      submitMeasurements(measurementsInfo),
    {
      onSuccess: function () {
        console.log(measurementsInfo)
        console.log('Measurements submitted successfully')
        navigate('/')
      },
      onError: function (apiError: APIError) {
        setErrorMessage(Object.values(apiError.errors).join(' '))
      },
    }
  )

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const chosenDate = new Date(dateOfEntry)
    const loadedProgressDate = new Date(measurementsInfo.doE!)

    if (chosenDate.toDateString() === loadedProgressDate.toDateString()) {
      console.log('hey')
      try {
        await updateMeasurements(measurementsInfo)
        console.log('Entry updated successfully.')
        navigate(`/`)
      } catch (error) {
        console.error('Error updating measurementsInfo:', error)
      }
    } else {
      delete measurementsInfo.id
    }
    measurementsInfo.doE = dateOfEntry

    try {
      await Promise.all([
        (measurementsInfo.userId = Number(id)),
        createMeasurementsMutation.mutate(measurementsInfo),
      ])
      navigate(`/`)
    } catch (error) {
      console.error('Error submitting both stats and goal:', error)
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target
    const numericValue = parseFloat(value)

    if (measurementsInfo.userId === 0) {
      console.log(measurementsInfo.userId, id)
      setMeasurementsInfo((prev) => ({
        ...prev,
        userId: Number(id),
        doE: new Date(),
      }))
    }
    setDateOfEntry(new Date())

    switch (name) {
      case 'waist':
        if (unit === 'metric') {
          setWaist(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            waistMetric: numericValue,
            waistImperial: convertLengthToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setWaist(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            waistMetric: convertLengthToMetric(numericValue),
            waistImperial: numericValue,
          }))
        }
        break

      case 'neck':
        if (unit === 'metric') {
          setNeck(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            neckMetric: numericValue,
            neckImperial: convertLengthToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setNeck(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            neckMetric: convertLengthToMetric(numericValue),
            neckImperial: numericValue,
          }))
        }
        break

      case 'hips':
        if (unit === 'metric') {
          setHips(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            hipsMetric: numericValue,
            hipsImperial: convertLengthToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setHips(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            hipsMetric: convertLengthToMetric(numericValue),
            hipsImperial: numericValue,
          }))
        }
        break

      case 'forearm':
        if (unit === 'metric') {
          setForearm(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            rightForearmMetric: numericValue,
            rightForearmImperial: convertLengthToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setForearm(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            rightForearmMetric: convertLengthToMetric(numericValue),
            rightForearmImperial: numericValue,
          }))
        }
        break

      case 'wrist':
        if (unit === 'metric') {
          setWrist(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            rightWristMetric: numericValue,
            rightWristImperial: convertLengthToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setWrist(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            rightWristMetric: convertLengthToMetric(numericValue),
            rightWristImperial: numericValue,
          }))
        }
        break

      case 'thigh':
        if (unit === 'metric') {
          setThigh(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            rightThighMetric: numericValue,
            rightThighImperial: convertLengthToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setThigh(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            rightThighMetric: convertLengthToMetric(numericValue),
            rightThighImperial: numericValue,
          }))
        }
        break

      case 'calf':
        if (unit === 'metric') {
          setCalf(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            rightCalfMetric: numericValue,
            rightCalfImperial: convertLengthToImperial(numericValue),
          }))
        } else if (unit === 'imperial') {
          setCalf(numericValue)
          setMeasurementsInfo((prev) => ({
            ...prev,
            rightCalfMetric: convertLengthToMetric(numericValue),
            rightCalfImperial: numericValue,
          }))
        }
        break

      default:
        break
    }
  }

  // Get user and load data if data is in Database
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
          const measurements = user.measurements?.[user.measurements.length - 1]

          // Set measurements
          if (measurements) {
            setMeasurementsInfo({ ...measurements })

            setWaist(measurements.waistImperial || '')
            setNeck(measurements.neckImperial || '')
            setHips(measurements.hipsImperial || '')
            setForearm(measurements.rightForearmImperial || '')
            setWrist(measurements.rightWristImperial || '')
            setThigh(measurements.rightThighImperial || '')
            setCalf(measurements.rightCalfImperial || '')
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

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
              <label htmlFor="waist">
                Enter Your Details
                <br />
                <br />
                Waist{unit === 'metric' ? ' (cm)' : ' (in)'}:
              </label>
              <input
                type="number"
                name="waist"
                placeholder="Waist"
                value={waist || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-input">
              <label htmlFor="neck">
                Neck{unit === 'metric' ? ' (cm)' : ' (in)'}:
              </label>
              <input
                type="number"
                className="form-control"
                name="neck"
                placeholder="Neck"
                value={neck || ''}
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="form-input">
              <label htmlFor="hips">
                Hips{unit === 'metric' ? ' (cm)' : ' (in)'}:
              </label>
              <input
                type="number"
                className="form-control"
                name="hips"
                placeholder="Hips"
                value={hips || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-input">
              <label htmlFor="forearm">
                Forearm{unit === 'metric' ? ' (cm)' : ' (in)'}:
              </label>
              <input
                type="number"
                name="forearm"
                placeholder="Forearm"
                value={forearm || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-input">
              <label htmlFor="wrist">
                Wrist{unit === 'metric' ? ' (cm)' : ' (in)'}:
              </label>
              <input
                type="number"
                className="form-control"
                name="wrist"
                placeholder="Wrist"
                value={wrist || ''}
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="form-input">
              <label htmlFor="thigh">
                Thigh{unit === 'metric' ? ' (cm)' : ' (in)'}:
              </label>
              <input
                type="number"
                className="form-control"
                name="thigh"
                placeholder="Thigh"
                value={thigh || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-input">
              <label htmlFor="calf">
                Calf{unit === 'metric' ? ' (cm)' : ' (in)'}:
              </label>
              <input
                type="number"
                className="form-control"
                name="calf"
                placeholder="Calf"
                value={calf || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    </main>
  )
}

export default Measurements
