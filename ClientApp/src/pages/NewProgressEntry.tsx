import React, { useEffect, useState } from 'react'
import { APIError, ProgressType, UserType } from '../types/types'
import { authHeader, getUser } from '../types/auth'
import { useNavigate } from 'react-router'
import { useMutation } from 'react-query'

async function submitProgress(entryToCreate: ProgressType) {
  const response = await fetch('/api/Users/:username', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(entryToCreate),
  })

  if (response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

const NewProgressEntry = () => {
  // needs to get the user Stats for these calculations. Will use stubs for now
  // Stats
  const heightImperial = 72
  const heightMetric = Math.round((heightImperial / 0.3937007874) * 100) / 100
  const age = 48
  const sex: 'M' | 'F' = 'M'

  const activityLevel = 1.2
  // const calories1 = 0 // 2000
  const bodyFatPercent = 0
  const tdeeCalc = 0
  const steps = 0

  // Measurements
  const waist = 37
  const neck = 14.5
  const hips = 39
  const forearm = 11.625
  const wrist = 6.625
  const thigh = 25
  const calf = 15
  const [errorMessage, setErrorMessage] = React.useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('TDEE')
  const [unit, setUnit] = useState('imperial')
  const [weight, setWeight] = useState(0)
  const [calories, setCalories] = useState(0)
  const [bmrMifflin, setBmrMifflin] = useState(0)
  const [bmrKatch, setBmrKatch] = useState(0)
  const [rmrMifflin, setRmrMifflin] = useState(0)
  const [rmrKatch, setRmrKatch] = useState(0)
  const [rmrCunningham, setRmrCunningham] = useState(0)
  const [tdeeMifflin, setTdeeMifflin] = useState(0)
  const [tdeeKatch, setTdeeKatch] = useState(0)
  const [lbmBoer, setLbmBoer] = useState(0)
  const [lbmCalc, setLbmCalc] = useState(0)
  const [covertBailey, setCovertBailey] = useState(0)
  const [navyBfp, setNavyBfp] = useState(0)
  const [ymcaBfp, setYmcaBfp] = useState(0)
  const [modYmcaBfp, setModYmcaBfp] = useState(0)
  const [averageBfp, setAverageBfp] = useState(0)
  const [bmiBfp, setBmiBfp] = useState(0)
  const [bmi, setBmi] = useState(0)
  const [progress, setProgress] = useState<ProgressType>({
    weightMetric: 0,
    weightImperial: 0,
    calories: 0,
  })
  const navigate = useNavigate()

  const [user, setUser] = useState<UserType>({
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
    goal: {
      goalSelection: 'maintain',
      goalWeight: 0,
      goalRate: 0,
      goalBfp: 0,
      goalDate: new Date(),
    },
    progress: {
      weightMetric: 0,
      weightImperial: 0,
      calories: 0,
    },
  })

  const createProgressMutation = useMutation(
    (progress: ProgressType) => submitProgress(progress),
    {
      onSuccess: function () {
        navigate('/')
      },
      onError: function (apiError: APIError) {
        setErrorMessage(Object.values(apiError.errors).join(' '))
      },
    }
  )

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    calculateResults(progress)
    setIsSubmitted(true)
    //
    console.log(user)
    //
    createProgressMutation.mutate(progress)
  }

  const convertToImperial = (kg: number) => kg * 2.20462
  const convertToMetric = (lbs: number) => lbs / 2.20462

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const value = parseFloat(event.target.value)

    if (name === 'weight') {
      if (unit === 'metric') {
        setWeight(value)
        setProgress((prev) => ({
          ...prev,
          weightMetric: value,
          weightImperial: convertToImperial(value),
          calories: prev.calories,
        }))
      } else if (unit === 'imperial') {
        console.log(value)
        setWeight(value)
        setProgress((prev) => ({
          ...prev,
          weightMetric: convertToMetric(value),
          weightImperial: value,
          calories: prev.calories,
        }))
      }
    }

    if (name === 'calories') {
      setCalories(value)
      setProgress((prev) => ({
        ...prev,
        weightMetric: prev.weightMetric,
        weightImperial: prev.weightImperial,
        calories: value,
      }))
    }
  }

  const displayValue =
    unit === 'metric'
      ? Math.round(weight * 100) / 100
      : Math.round(weight * 100) / 100

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric'

      setProgress((prevInput) => {
        const newWeightMetric =
          newUnit === 'metric'
            ? prevInput.weightMetric!
            : convertToMetric(prevInput.weightImperial!)
        const newWeightImperial =
          newUnit === 'imperial'
            ? prevInput.weightImperial!
            : convertToImperial(prevInput.weightMetric!)
        const date = new Date()
        setWeight(newUnit === 'metric' ? newWeightMetric : newWeightImperial)

        return {
          dateOfEntry: date,
          weightMetric: newWeightMetric,
          weightImperial: newWeightImperial,
          calories: calories,
        }
      })
      return newUnit
    })
  }

  useEffect(() => {
    calculateResults(progress)
  }, [unit, progress])

  const calculateResults = ({ weightMetric, weightImperial }: ProgressType) => {
    /////////
    // BMI //
    /////////
    // Not particular useful number, included for use in Heritage equation
    const bmi = weightMetric! / Math.pow(heightMetric / 100, 2)
    setBmi(bmi)

    /////////////////////////
    // Body Fat Percentage //
    /////////////////////////

    // U.S. Navy Formula for Body Fat Percentage
    const navyBfpCalc =
      // Metric
      unit === 'metric'
        ? sex === 'M'
          ? 495 /
              (1.0324 -
                0.19077 * Math.log10(waist * 2.54 - neck * 2.54) +
                0.15456 * Math.log10(heightMetric)) -
            450
          : // female calc off?
            495 /
              (1.29579 -
                0.35004 * Math.log10(waist * 2.54 + hips * 2.54 - neck * 2.54) +
                0.221 * Math.log10(heightMetric)) -
            450
        : // Imperial formula
          sex === 'M'
          ? 86.01 * Math.log10(waist - neck) -
            70.041 * Math.log10(heightImperial) +
            36.76
          : 163.205 * Math.log10(waist + hips - neck) -
            97.684 * Math.log10(heightImperial) -
            78.387

    // Covert Bailey Formula
    // Imperial formula
    const covertBaileyCalc =
      sex === 'M'
        ? age < 30
          ? waist + 0.5 * hips - 3 * forearm - wrist
          : waist + 0.5 * hips - 2.7 * forearm - wrist
        : age < 30
          ? hips + 0.8 * thigh - 2 * calf - wrist
          : hips + thigh - 2 * calf - wrist

    // Heritage BMI to Body Fat Percentage Formula
    // may be off (or bmi may be off)? It is off from the hub pages persons report
    const heritageBfpCalc =
      sex === 'M'
        ? // (977.17 * weightImperial) / Math.pow(heightImperial, 2) +
          // 0.16 * age -
          // 19.34
          1.39 * bmi + 0.16 * age - 19.34
        : 1.39 * bmi + 0.16 * age - 9

    // YMCA Body Fat Percentage Formula
    const ymcaBfpCalc =
      sex === 'M'
        ? ((4.15 * waist - 0.082 * weightImperial! - 98.42) / weightImperial!) *
          100
        : ((4.15 * waist - 0.082 * weightImperial! - 76.76) / weightImperial!) *
          100

    // Modified YMCA Body Fat Percentage Formula
    const modYmcaBfpCalc =
      sex === 'M'
        ? ((-0.082 * weightImperial! + 4.15 * waist - 94.42) /
            weightImperial!) *
          100
        : ((0.268 * weightImperial! -
            0.318 * wrist +
            0.157 * waist +
            0.245 * hips -
            0.434 * forearm -
            8.987) /
            weightImperial!) *
          100

    const averageBfpCalc =
      (navyBfpCalc + covertBaileyCalc + ymcaBfpCalc + modYmcaBfpCalc) / 4

    setNavyBfp(navyBfpCalc)
    setCovertBailey(covertBaileyCalc)
    setBmiBfp(heritageBfpCalc)
    setYmcaBfp(ymcaBfpCalc)
    setModYmcaBfp(modYmcaBfpCalc)
    setAverageBfp(averageBfpCalc)

    ////////////////////////////////
    // Lean Body Mass Estimations //
    ////////////////////////////////

    // Calculated Lean Body Mass using recorded weight and Navy Method's result
    const selectedBfp = bodyFatPercent === 0 ? navyBfpCalc : bodyFatPercent
    const lbmKatchCalc = weightImperial! * (1 - selectedBfp / 100)

    // Boer formula for obese individuals with a BMI between 35 and 40
    const lbmBoerCalc =
      unit === 'metric'
        ? sex === 'M'
          ? 0.407 * weightMetric! + 0.267 * heightMetric - 19.2
          : 0.252 * weightMetric! + 0.473 * heightMetric - 48.3
        : sex === 'M'
          ? (0.407 * weightMetric! + 0.267 * heightMetric - 19.2) * 2.20462
          : (0.252 * weightMetric! + 0.473 * heightMetric - 48.3) * 2.20462

    // Hume formula used for drug dosages
    // let lbmHumeCalc =
    //   sex === 'M'
    //     ? 0.3281 * weightMetric + 0.33929 * heightMetric - 29.5336
    //     : 0.29569 * weightMetric + 0.41813 * heightMetric - 43.2933

    // James formula used in obese individuals or those with abnormal body compositions
    // let lbmJamesCalc =
    //   sex === 'M'
    //     ? 1.1 * weightMetric - 128 * Math.pow(weightMetric / heightMetric, 2)
    //     : 1.07 * weightMetric - 148 * Math.pow(weightMetric / heightMetric, 2)

    setLbmCalc(lbmKatchCalc)
    setLbmBoer(lbmBoerCalc)

    //////////////////////
    // BMR Calculations //
    //////////////////////

    // Mifflin St Jeor Formula
    const bmrMifflinCalc =
      sex === 'M'
        ? 10 * weightMetric! + 6.25 * heightMetric - 5 * age + 5
        : 10 * weightMetric! + 6.25 * heightMetric - 5 * age - 161

    // Katch-McArdle Formula
    const bmrKatchCalc = 370 + 21.6 * (weightMetric! * (1 - selectedBfp / 100))

    setBmrKatch(bmrKatchCalc)
    setBmrMifflin(bmrMifflinCalc)

    //////////////////
    // RDEE and RMR //
    //////////////////

    // Cunningham Formula
    const cunninghamCalc = 500 + 22 * (lbmKatchCalc / 2.20462)
    // Mifflin St Jeor Formula
    const rmrMifflinCalc = bmrMifflinCalc * 1.11
    // Katch-McArdle Formula
    const rmrKatchCalc =
      (370 + 21.6 * (weightMetric! * (1 - selectedBfp / 100))) * 1.11

    setRmrCunningham(cunninghamCalc)
    setRmrMifflin(rmrMifflinCalc)
    setRmrKatch(rmrKatchCalc)

    ///////////////////////
    // TDEE Calculations //
    ///////////////////////
    const tdeeMifflinCalc = bmrMifflinCalc * activityLevel
    const tdeeKatchCalc = bmrKatchCalc * activityLevel

    setTdeeMifflin(tdeeMifflinCalc)
    setTdeeKatch(tdeeKatchCalc)
  }

  useEffect(() => {
    const tempUser = getUser()
    setUser((prev) => ({
      ...prev,
      fullName: tempUser.fullName,
      email: tempUser.email,
    }))
  }, [])

  return (
    <main className="calories-page">
      <h1>FitMatrix</h1>
      <div className="calories-container">
        <button onClick={toggleUnit}>
          Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
        </button>
        <form onSubmit={handleFormSubmit}>
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <p className="form-input">
            <label htmlFor="weight">{`Enter today's weight:`}</label>
            <input
              type="number"
              className="form-control"
              name="weight"
              placeholder="Weight"
              value={displayValue || ''}
              required
              onChange={handleInputChange}
            />
          </p>
          <p className="form-input">
            <label htmlFor="calories">
              {`Enter today's total calories:`}
              <span className="reminder">
                Remember to measure RAW ingredients
              </span>
            </label>
            <input
              type="number"
              name="calories"
              placeholder="Calories"
              value={calories || ''}
              onChange={handleInputChange}
              // onChange={(event) => setCalories(parseFloat(event.target.value))}
            />
          </p>
          <p>
            <input type="submit" value="Submit" />
          </p>
        </form>
        {/* </div> */}

        <div className={`calories-user-stats ${isSubmitted ? 'show' : ''}`}>
          <div className="button-group">
            <button onClick={() => setSelectedFilter('BF%')}>BF%</button>
            <button onClick={() => setSelectedFilter('BMR')}>BMR</button>
            <button onClick={() => setSelectedFilter('LBM')}>LBM</button>
            <button onClick={() => setSelectedFilter('TDEE')}>TDEE</button>
            <button onClick={() => setSelectedFilter('ALL')}>ALL</button>
          </div>
          {(selectedFilter === 'ALL' ||
            selectedFilter === 'TDEE' ||
            selectedFilter === 'BMR') && (
            <div>All metabolic expenditures report in Kcal/day</div>
          )}
          {selectedFilter === 'ALL' || selectedFilter === 'BMR' ? (
            <>
              <div className="result-row">
                <div className="result-label">BMR (Mifflin St. Jeor):</div>
                <div className="result-value"> {bmrMifflin.toFixed(0)}</div>
              </div>
              {/* {bodyFatPercent > 0 && (
            <div className="result-row">
              <div className="result-label">BMR (Katch-McArdle):</div>
              <div className="result-value">{bmrKatch.toFixed(0)}</div>
            </div>
          )} */}
              <div className="result-row">
                <div className="result-label">BMR (Katch-McArdle):</div>
                <div className="result-value"> {bmrKatch.toFixed(0)} </div>
              </div>
              <div className="result-row">
                <div className="result-label">RMR (Cunningham):</div>
                <div className="result-value"> {rmrCunningham.toFixed(0)} </div>
              </div>
              <div className="result-row">
                <div className="result-label">RMR (Mifflin St. Jeor):</div>
                <div className="result-value"> {rmrMifflin.toFixed(0)} </div>
              </div>
              <div className="result-row">
                <div className="result-label">RMR (Katch-McArdle):</div>
                <div className="result-value">{rmrKatch.toFixed(0)} </div>
              </div>
              <div className="result-row">
                <div className="result-label"></div>
                <div className="result-value"></div>
              </div>
            </>
          ) : null}
          {selectedFilter === 'ALL' || selectedFilter === 'TDEE' ? (
            <>
              <div className="result-row">
                <div className="result-label">TDEE (Mifflin St. Jeor):</div>
                <div className="result-value"> {tdeeMifflin.toFixed(0)}</div>
              </div>
              {/* {bodyFatPercent > 0 && ( */}
              <div className="result-row">
                <div className="result-label">TDEE (Katch-McArdle):</div>
                <div className="result-value">{tdeeKatch.toFixed(0)} </div>
              </div>
              {/* )} */}

              {isSubmitted && tdeeCalc !== 0 && (
                <div className="result-row">
                  <div className="result-label">
                    TDEE (Calculated with logged calories and weight):
                  </div>
                  <div className="result-value"></div>
                </div>
              )}
            </>
          ) : null}
          {selectedFilter === 'ALL' || selectedFilter === 'LBM' ? (
            <>
              <div className="result-row">
                <div className="result-label">
                  Lean Body Mass (calculated from Body Fat Percent):
                </div>
                <div className="result-value">{lbmCalc.toFixed(1)}</div>
              </div>
              <div className="result-row">
                <div className="result-label">Lean Body Mass (Boer):</div>
                <div className="result-value">{lbmBoer.toFixed(1)}</div>
              </div>
              {/* <div className="result-row">
                <div className="result-label">Lean Body Mass (James):</div>
                <div className="result-value">{lbmJames.toFixed(1)}</div>
              </div>
              <div className="result-row">
                <div className="result-label">Lean Body Mass (Hume):</div>
                <div className="result-value">{lbmHume.toFixed(1)}</div>
              </div> */}
            </>
          ) : null}
          {selectedFilter === 'ALL' || selectedFilter === 'BF%' ? (
            <>
              {/* Body Fat Percentages */}
              <div className="result-row">
                <div className="result-label">Covert Bailey Method:</div>
                <div className="result-value"> {covertBailey.toFixed(1)}%</div>
              </div>
              <div className="result-row">
                <div className="result-label">Navy Method:</div>
                <div className="result-value"> {navyBfp.toFixed(1)}%</div>
              </div>
              <div className="result-row">
                <div className="result-label">YMCA Method:</div>
                <div className="result-value"> {ymcaBfp.toFixed(1)}%</div>
              </div>
              <div className="result-row">
                <div className="result-label">Modified YMCA Method:</div>
                <div className="result-value"> {modYmcaBfp.toFixed(1)}%</div>
              </div>

              <div className="result-row">
                <div className="result-label">
                  Heritage BMI to Body Fat Percentage Method:
                </div>
                <div className="result-value"> {bmiBfp.toFixed(1)}%</div>
              </div>
              <div className="result-row">
                <div className="result-label">Average Body Fat Percent:</div>
                <div className="result-value"> {averageBfp.toFixed(1)}%</div>
              </div>
              <div className="result-row">
                <div className="result-label">BMI:</div>
                <div className="result-value"> {bmi.toFixed(1)}</div>
              </div>
              <div className="result-row">
                <div className="result-label"></div>
                <div className="result-value"></div>
              </div>
            </>
          ) : null}
          {isSubmitted && steps !== 0 && (
            <div className="result-row">
              <div className="result-label">Steps:</div>
              <div className="result-value"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default NewProgressEntry
