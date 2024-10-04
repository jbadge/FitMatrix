import React, { useEffect, useState } from 'react'
import { APIError, ProgressType, StatsType } from '../types/types'
import { authHeader } from '../types/auth'
import { useParams } from 'react-router'
import { useMutation } from 'react-query'

async function submitProgress(id: number, entry: ProgressType) {
  // const userId = Number(id)
  console.log('id: ', entry)
  const response = await fetch(`/api/Users/${id}/progress`, {
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
// Need to make sure IF LOGGED IN it routes to /user/id/progress!!

const Progress = () => {
  const { id } = useParams() as { id: string }

  // needs to get the user Stats for these calculations. Will use stubs for now
  // Stats
  const activityLevel = 1.2

  const [errorMessage, setErrorMessage] = React.useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('TDEE')
  const [unit, setUnit] = useState('imperial')
  const [calories, setCalories] = useState(1500)
  const [bodyFatPercent, setBodyFatPercent] = useState(0)
  const [bmrMifflin, setBmrMifflin] = useState(0)
  const [bmrKatch, setBmrKatch] = useState(0)
  const [rmrMifflin, setRmrMifflin] = useState(0)
  const [rmrKatch, setRmrKatch] = useState(0)
  const [rmrCunningham, setRmrCunningham] = useState(0)
  const [tdeeMifflin, setTdeeMifflin] = useState(0)
  const [tdeeKatch, setTdeeKatch] = useState(0)
  const [lbmBoer, setLbmBoer] = useState(0)
  const [lbmKatch, setLbmKatch] = useState(0)
  const [covertBailey, setCovertBailey] = useState(0)
  const [navyBfp, setNavyBfp] = useState(0)
  const [ymcaBfp, setYmcaBfp] = useState(0)
  const [modYmcaBfp, setModYmcaBfp] = useState(0)
  const [averageBfp, setAverageBfp] = useState(0)
  const [bmiBfp, setBmiBfp] = useState(0)
  const [bmi, setBmi] = useState(0)
  const [progress, setProgress] = useState<ProgressType>({
    userId: 0,
    progressWeightImperial: 0,
    progressWeightMetric: 0,
    calories: 0,
    bodyFatPercent: 0,
  })

  // const [checked, setChecked] = useState(false)

  const [age, setAge] = useState(0)
  const [sex, setSex] = useState('U')
  const [weight, setWeight] = useState(185)

  const convertWeightToImperial = (kg: number) => kg / 0.45359237
  const convertWeightToMetric = (lbs: number) => lbs * 0.45359237

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

  const createProgressMutation = useMutation(
    (progress: ProgressType) => submitProgress(Number(id), progress),
    {
      onSuccess: function () {
        // navigate('/')
      },
      onError: function (apiError: APIError) {
        setErrorMessage(Object.values(apiError.errors).join(' '))
      },
    }
  )

  // Stats
  //////
  // TDEECALC is done with Progress Table
  const tdeeCalc = 0
  // Steps is brought in from device
  const steps = 0

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
  /////////////////////////////////////////////////

  const displayWeightValue =
    unit === 'metric'
      ? Math.round(weight * 100) / 100
      : Math.round(weight * 100) / 100

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (progress) {
      calculateResults(progress)
      setIsSubmitted(true)
    }

    createProgressMutation.mutate(progress)
  }

  // Speed up testing
  useEffect(() => {
    setProgress((prev) => ({
      ...prev,
      calories: calories,
      progressWeightImperial: weight,
      progressWeightMetric: convertWeightToMetric(weight),
    }))
  }, [])

  // function handleCheck() {
  //   setChecked((prev) => !prev)
  // }

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
    if (progress) {
      calculateResults(progress)
    }
  }, [unit]) //, progress])

  const calculateResults = ({
    progressWeightMetric,
    progressWeightImperial,
  }: ProgressType) => {
    /////////
    // BMI //
    /////////
    // Not particular useful number, included for use in Heritage equation
    const bmi =
      progressWeightMetric! / Math.pow(statsInfo.heightMetric / 100, 2)
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
                0.15456 * Math.log10(statsInfo.heightMetric)) -
            450
          : // female calc off?
            495 /
              (1.29579 -
                0.35004 * Math.log10(waist * 2.54 + hips * 2.54 - neck * 2.54) +
                0.221 * Math.log10(statsInfo.heightMetric)) -
            450
        : // Imperial formula
          sex === 'M'
          ? 86.01 * Math.log10(waist - neck) -
            70.041 * Math.log10(statsInfo.heightImperial) +
            36.76
          : 163.205 * Math.log10(waist + hips - neck) -
            97.684 * Math.log10(statsInfo.heightImperial) -
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
        ? // (977.17 * weightImperial) / Math.pow(statsInfo.heightImperial, 2) +
          // 0.16 * age -
          // 19.34
          1.39 * bmi + 0.16 * age - 19.34
        : 1.39 * bmi + 0.16 * age - 9

    // YMCA Body Fat Percentage Formula
    const ymcaBfpCalc =
      sex === 'M'
        ? ((4.15 * waist - 0.082 * progressWeightImperial! - 98.42) /
            progressWeightImperial!) *
          100
        : ((4.15 * waist - 0.082 * progressWeightImperial! - 76.76) /
            progressWeightImperial!) *
          100

    // Modified YMCA Body Fat Percentage Formula
    const modYmcaBfpCalc =
      sex === 'M'
        ? ((-0.082 * progressWeightImperial! + 4.15 * waist - 94.42) /
            progressWeightImperial!) *
          100
        : ((0.268 * progressWeightImperial! -
            0.318 * wrist +
            0.157 * waist +
            0.245 * hips -
            0.434 * forearm -
            8.987) /
            progressWeightImperial!) *
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
    const lbmKatchCalc = progressWeightImperial! * (1 - selectedBfp / 100)

    // Boer formula for obese individuals with a BMI between 35 and 40
    const lbmBoerCalc =
      unit === 'metric'
        ? sex === 'M'
          ? 0.407 * progressWeightMetric! +
            0.267 * statsInfo.heightMetric -
            19.2
          : 0.252 * progressWeightMetric! +
            0.473 * statsInfo.heightMetric -
            48.3
        : sex === 'M'
          ? (0.407 * progressWeightMetric! +
              0.267 * statsInfo.heightMetric -
              19.2) *
            2.20462
          : (0.252 * progressWeightMetric! +
              0.473 * statsInfo.heightMetric -
              48.3) *
            2.20462

    // Hume formula used for drug dosages
    // let lbmHumeCalc =
    //   sex === 'M'
    //     ? 0.3281 * weightMetric + 0.33929 * statsInfo.heightMetric - 29.5336
    //     : 0.29569 * weightMetric + 0.41813 * statsInfo.heightMetric - 43.2933

    // James formula used in obese individuals or those with abnormal body compositions
    // let lbmJamesCalc =
    //   sex === 'M'
    //     ? 1.1 * weightMetric - 128 * Math.pow(weightMetric / statsInfo.heightMetric, 2)
    //     : 1.07 * weightMetric - 148 * Math.pow(weightMetric / statsInfo.heightMetric, 2)

    setLbmKatch(lbmKatchCalc)
    setLbmBoer(lbmBoerCalc)

    //////////////////////
    // BMR Calculations //
    //////////////////////

    // Mifflin St Jeor Formula
    const bmrMifflinCalc =
      sex === 'M'
        ? 10 * progressWeightMetric! +
          6.25 * statsInfo.heightMetric -
          5 * age +
          5
        : 10 * progressWeightMetric! +
          6.25 * statsInfo.heightMetric -
          5 * age -
          161

    // Katch-McArdle Formula
    const bmrKatchCalc =
      370 + 21.6 * (progressWeightMetric! * (1 - selectedBfp / 100))

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
      (370 + 21.6 * (progressWeightMetric! * (1 - selectedBfp / 100))) * 1.11

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
          // const goal =
          //   user.goal && user.goal.length > 0
          //     ? user.goal[user.goal.length - 1]
          //     : undefined

          // Set stats
          if (stats) {
            delete stats.id
            setStatsInfo({
              ...stats,
              userId: user.id,
            })
            setAge(stats.age || '')
            // setDateOfBirth(stats.doB)
            // if (stats.doB) {
            //   const dob = new Date(stats.doB)
            //   setMonth(dob.getMonth() + 1)
            //   setDay(dob.getDate())
            //   setYear(dob.getFullYear())
            // }

            setSex(stats.sex || '')
            // setHeight(stats.statsInfo.heightImperial || '')
            // setWeight(stats.weightImperial || '')
            // setActivityLevelLabel(stats.activityLevelLabel || '')
            setBodyFatPercent(stats.bodyFatPercent || '')
            if (stats.bodyFatPercent !== 0) {
              // setChecked(true)
            }
          }

          // Set goals
          // if (goal) {
          //   delete goal.id
          //   setGoalInfo({
          //     ...goal,
          //     userId: user.id,
          //   })

          //   setCheckedGoals({
          //     lose: goal.goalSelection === 'lose',
          //     gain: goal.goalSelection === 'gain',
          //     maintain: goal.goalSelection === 'maintain',
          //   })

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

          // setGoalRateLoseImperial(goal.goalRateLoseImperial)
          // setGoalRateLoseMetric(goal.goalRateLoseMetric)
          // setGoalWeightLoseImperial(goal.goalWeightLoseImperial)
          // setGoalWeightLoseMetric(goal.goalWeightLoseMetric)
          // setGoalRateGainImperial(goal.goalRateGainImperial)
          // setGoalRateGainMetric(goal.goalRateGainMetric)
          // setGoalWeightGainImperial(goal.goalWeightGainImperial)
          // setGoalWeightGainMetric(goal.goalWeightGainMetric)
          // setGoalDate(goal.goalDate)
          // }
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
      <h6>Remember, drink 8 glasses of water a day!</h6>
      <div className="user-container">
        <div className="button-container">
          <button onClick={toggleUnit}>
            Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <p className="form-input">
            <label htmlFor="weight">{`Enter today's weight:`}</label>
            <input
              type="number"
              className="form-control"
              name="weight"
              placeholder="Weight"
              value={displayWeightValue || ''}
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
            />
          </p>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
        <div className={`calories-user-stats ${isSubmitted ? 'show' : ''}`}>
          <div className="button-group">
            <button onClick={() => setSelectedFilter('TDEE')}>
              Total Daily Energy Expenditure
            </button>
            <button onClick={() => setSelectedFilter('BF%')}>
              Body Fat Percent
            </button>
            <button onClick={() => setSelectedFilter('LBM')}>
              Lean Body Mass
            </button>
            <button onClick={() => setSelectedFilter('BMR')}>
              Basal Metabolic Rate
            </button>
            <button onClick={() => setSelectedFilter('ALL')}>ALL</button>
          </div>
          {selectedFilter === 'ALL' || selectedFilter === 'BMR' ? (
            <>
              <p>
                Basal Metabolic Rate, or BMR, is the amount of calories burned
                at rest as a result of normal involuntary body functions.
                <br />
                <br />
                Resting Metabolic Rate, or RMR, is the number of calories your
                body actually burns at rest, including intentional movement of
                the body.
                <br />
                <br />
                All metabolic expenditure formulas report in Kcal/day.
              </p>
              <div className="result-row">
                <div className="result-label">
                  BMR (Mifflin St. Jeor Formula):
                </div>
                <div className="result-value"> {bmrMifflin.toFixed(0)}</div>
              </div>
              {/* {bodyFatPercent > 0 && (
            <div className="result-row">
              <div className="result-label">BMR (Katch-McArdle):</div>
              <div className="result-value">{bmrKatch.toFixed(0)}</div>
            </div>
          )} */}
              <div className="result-row">
                <div className="result-label">BMR (Katch-McArdle Formula):</div>
                <div className="result-value"> {bmrKatch.toFixed(0)} </div>
              </div>
              <div className="result-row">
                <div className="result-label">RMR (Cunningham Formula):</div>
                <div className="result-value"> {rmrCunningham.toFixed(0)} </div>
              </div>
              <div className="result-row">
                <div className="result-label">
                  RMR (Mifflin St. Jeor Formula):
                </div>
                <div className="result-value"> {rmrMifflin.toFixed(0)} </div>
              </div>
              <div className="result-row">
                <div className="result-label">RMR (Katch-McArdle Formula):</div>
                <div className="result-value">{rmrKatch.toFixed(0)} </div>
              </div>
            </>
          ) : null}
          {selectedFilter === 'ALL' || selectedFilter === 'TDEE' ? (
            <>
              <p>
                TDEE (Total Daily Energy Expenditure) is the estimated number of
                calories you burn each day, based on defined activity levels.
                <br />
                <br />
                All metabolic expenditure formulas report in Kcal/day.
              </p>
              <div className="result-row">
                <div className="result-label">
                  TDEE (Mifflin St. Jeor Formula):
                </div>
                <div className="result-value"> {tdeeMifflin.toFixed(0)}</div>
              </div>
              {/* {bodyFatPercent > 0 && ( */}
              <div className="result-row">
                <div className="result-label">
                  TDEE (Katch-McArdle Formula):
                </div>
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
              <p>
                Lean body mass, LBM, refers to everything except fat; muscle,
                organs, bone, etc.
              </p>
              {bodyFatPercent > 0 && (
                <div className="result-row">
                  <div className="result-label">
                    Lean Body Mass (calculated from Body Fat Percent):
                  </div>
                  <div className="result-value">{lbmKatch.toFixed(1)}</div>
                </div>
              )}
              <div className="result-row">
                <div className="result-label">Lean Body Mass (Boer):</div>
                <div className="result-value">{lbmBoer.toFixed(1)}</div>
              </div>
              {bodyFatPercent > 0 && lbmBoer ? null : (
                <>
                  <div className="result-row">
                    <div className="result-label"></div>
                    <div className="result-value"></div>
                  </div>
                  <div className="result-row">
                    <div className="result-label"></div>
                    <div className="result-value"></div>
                  </div>
                  <div className="result-row">
                    <div className="result-label"></div>
                    <div className="result-value"></div>
                  </div>
                </>
              )}
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
              <p>
                Body fat percentage is how much of your body is made up of
                adipose tissue (body fat) as opposed to muscle & bone.
                <br />
                <br />
                BMI is a crude but sometimes useful number that relates body
                weight to height. It is used sometimes to gauge whether a person
                is at a healthy weight.
              </p>
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
  // return (
  //   <main className="users-page">
  //     <h1>FitMatrix</h1>
  //     <div className="users-container">
  //     <div className="button-container">
  //         <button onClick={toggleUnit}>
  //           Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
  //         </button>
  //       </div>

  // <form onSubmit={handleFormSubmit}>
  //   {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
  //   <p className="form-input">
  //     <label htmlFor="weight">{`Enter today's weight:`}</label>
  //     <input
  //       type="number"
  //       className="form-control"
  //       name="weight"
  //       placeholder="Weight"
  //       value={displayValue || ''}
  //       required
  //       onChange={handleInputChange}
  //     />
  //   </p>
  //   <p className="form-input">
  //     <label htmlFor="calories">
  //       {`Enter today's total calories:`}
  //       <span className="reminder">
  //         Remember to measure RAW ingredients
  //       </span>
  //     </label>
  //     <input
  //       type="number"
  //       name="calories"
  //       placeholder="Calories"
  //       value={calories || ''}
  //       onChange={handleInputChange}
  //     />
  //   </p>
  //   <p>
  //     <input type="submit" value="Submit" />
  //   </p>
  // </form>
  //       <div className={`calories-user-stats ${isSubmitted ? 'show' : ''}`}>
  //         <div className="button-group">
  //           <button onClick={() => setSelectedFilter('BF%')}>BF%</button>
  //           <button onClick={() => setSelectedFilter('BMR')}>BMR</button>
  //           <button onClick={() => setSelectedFilter('LBM')}>LBM</button>
  //           <button onClick={() => setSelectedFilter('TDEE')}>TDEE</button>
  //           <button onClick={() => setSelectedFilter('ALL')}>ALL</button>
  //         </div>
  //         {(selectedFilter === 'ALL' ||
  //           selectedFilter === 'TDEE' ||
  //           selectedFilter === 'BMR') && (
  //           <div>All metabolic expenditures report in Kcal/day</div>
  //         )}
  //         {selectedFilter === 'ALL' || selectedFilter === 'BMR' ? (
  //           <>
  //             <div className="result-row">
  //               <div className="result-label">BMR (Mifflin St. Jeor):</div>
  //               <div className="result-value"> {bmrMifflin.toFixed(0)}</div>
  //             </div>
  //             {/* {bodyFatPercent > 0 && (
  //           <div className="result-row">
  //             <div className="result-label">BMR (Katch-McArdle):</div>
  //             <div className="result-value">{bmrKatch.toFixed(0)}</div>
  //           </div>
  //         )} */}
  //             <div className="result-row">
  //               <div className="result-label">BMR (Katch-McArdle):</div>
  //               <div className="result-value"> {bmrKatch.toFixed(0)} </div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">RMR (Cunningham):</div>
  //               <div className="result-value"> {rmrCunningham.toFixed(0)} </div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">RMR (Mifflin St. Jeor):</div>
  //               <div className="result-value"> {rmrMifflin.toFixed(0)} </div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">RMR (Katch-McArdle):</div>
  //               <div className="result-value">{rmrKatch.toFixed(0)} </div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label"></div>
  //               <div className="result-value"></div>
  //             </div>
  //           </>
  //         ) : null}
  //         {selectedFilter === 'ALL' || selectedFilter === 'TDEE' ? (
  //           <>
  //             <div className="result-row">
  //               <div className="result-label">TDEE (Mifflin St. Jeor):</div>
  //               <div className="result-value"> {tdeeMifflin.toFixed(0)}</div>
  //             </div>
  //             {/* {bodyFatPercent > 0 && ( */}
  //             <div className="result-row">
  //               <div className="result-label">TDEE (Katch-McArdle):</div>
  //               <div className="result-value">{tdeeKatch.toFixed(0)} </div>
  //             </div>
  //             {/* )} */}

  //             {isSubmitted && tdeeCalc !== 0 && (
  //               <div className="result-row">
  //                 <div className="result-label">
  //                   TDEE (Calculated with logged calories and weight):
  //                 </div>
  //                 <div className="result-value"></div>
  //               </div>
  //             )}
  //           </>
  //         ) : null}
  //         {selectedFilter === 'ALL' || selectedFilter === 'LBM' ? (
  //           <>
  //             <div className="result-row">
  //               <div className="result-label">
  //                 Lean Body Mass (calculated from Body Fat Percent):
  //               </div>
  //               <div className="result-value">{lbmCalc.toFixed(1)}</div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">Lean Body Mass (Boer):</div>
  //               <div className="result-value">{lbmBoer.toFixed(1)}</div>
  //             </div>
  //             {/* <div className="result-row">
  //               <div className="result-label">Lean Body Mass (James):</div>
  //               <div className="result-value">{lbmJames.toFixed(1)}</div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">Lean Body Mass (Hume):</div>
  //               <div className="result-value">{lbmHume.toFixed(1)}</div>
  //             </div> */}
  //           </>
  //         ) : null}
  //         {selectedFilter === 'ALL' || selectedFilter === 'BF%' ? (
  //           <>
  //             {/* Body Fat Percentages */}
  //             <div className="result-row">
  //               <div className="result-label">Covert Bailey Method:</div>
  //               <div className="result-value"> {covertBailey.toFixed(1)}%</div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">Navy Method:</div>
  //               <div className="result-value"> {navyBfp.toFixed(1)}%</div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">YMCA Method:</div>
  //               <div className="result-value"> {ymcaBfp.toFixed(1)}%</div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">Modified YMCA Method:</div>
  //               <div className="result-value"> {modYmcaBfp.toFixed(1)}%</div>
  //             </div>

  //             <div className="result-row">
  //               <div className="result-label">
  //                 Heritage BMI to Body Fat Percentage Method:
  //               </div>
  //               <div className="result-value"> {bmiBfp.toFixed(1)}%</div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">Average Body Fat Percent:</div>
  //               <div className="result-value"> {averageBfp.toFixed(1)}%</div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label">BMI:</div>
  //               <div className="result-value"> {bmi.toFixed(1)}</div>
  //             </div>
  //             <div className="result-row">
  //               <div className="result-label"></div>
  //               <div className="result-value"></div>
  //             </div>
  //           </>
  //         ) : null}
  //         {isSubmitted && steps !== 0 && (
  //           <div className="result-row">
  //             <div className="result-label">Steps:</div>
  //             <div className="result-value"></div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </main>
  // )
}

export default Progress
