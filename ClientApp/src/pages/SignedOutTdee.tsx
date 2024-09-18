import React, { useEffect, useState } from 'react'
import { SexOptionsType, StatsType } from '../types/types'

const SignedOutTdee = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('TDEE')
  const [unit, setUnit] = useState('imperial')
  const [age, setAge] = useState(48)
  const [sex, setSex] = useState('M')
  const [height, setHeight] = useState(72) //0)
  const [weight, setWeight] = useState(186) //0)
  const [activityLevel, setActivityLevel] = useState(1.2)
  const [activityLevelLabel, setActivityLevelLabel] = useState('Sedentary')
  const [bodyFatPercent, setBodyFatPercent] = useState(0)
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
  const [statsInfo, setStatsInfo] = React.useState<StatsType>({
    sex: 'M',
    heightMetric: 0,
    heightImperial: 0,
    weightMetric: 0,
    weightImperial: 0,
    activityLevel: 0,
    activityLevelLabel: 'Sedentary',
    bodyFatPercent: 0,
  })
  const [checked, setChecked] = useState(false)
  const convertWeightToImperial = (kg: number) => kg / 0.45359237
  const convertWeightToMetric = (lbs: number) => lbs * 0.45359237
  const convertHeightToImperial = (cm: number) => cm * 0.3937007874
  const convertHeightToMetric = (inch: number) => inch / 0.3937007874
  // needs to get the user Stats for these calculations. Will use stubs for now
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

  const displayHeightValue =
    unit === 'metric'
      ? Math.round(height * 100) / 100
      : Math.round(height * 100) / 100

  const displayWeightValue =
    unit === 'metric'
      ? Math.round(weight * 100) / 100
      : Math.round(weight * 100) / 100

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (statsInfo) {
      calculateResults(statsInfo)
      setIsSubmitted(true)
    }
  }

  function handleCheck() {
    setChecked((prev) => !prev)
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
        setAge(numericValue)
        setStatsInfo((prevStats) => ({
          ...prevStats,
          [name]: numericValue,
        }))
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
        setActivityLevelLabel(value)
        switch (value) {
          case 'Sedentary':
            setActivityLevel(1.2)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.2,
              activityLevelLabel: value,
            }))
            break
          case 'Light':
            setActivityLevel(1.425)
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.425,
              activityLevelLabel: value,
            }))
            break
          case 'Moderate':
            setActivityLevel(1.55)
            setActivityLevelLabel('Moderate')
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.55,
              activityLevelLabel: value,
            }))
            break
          case 'Heavy':
            setActivityLevel(1.75)
            setActivityLevelLabel('Heavy')
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.75,
              activityLevelLabel: value,
            }))
            break
          case 'Athlete':
            setActivityLevel(1.9)
            setActivityLevelLabel('Athlete')
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1.9,
              activityLevelLabel: value,
            }))
            break
          case 'None':
            setActivityLevel(1.2)
            setActivityLevelLabel('None')
            setStatsInfo((prevStats) => ({
              ...prevStats,
              activityLevel: 1,
              activityLevelLabel: value,
            }))
            break
        }
        break
      default:
        break
    }
  }

  /////////////////////////////////////////////////
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
      activityLevelLabel: 'Sedentary',
    }))
  }, [])
  /////////////////////////////////////////////////

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
          heightMetric: newHeightMetric,
          heightImperial: newHeightImperial,
          weightMetric: newWeightMetric,
          weightImperial: newWeightImperial,
        }
      })
      return newUnit
    })
  }

  useEffect(() => {
    if (statsInfo) {
      calculateResults(statsInfo)
    }
  }, [unit])

  const calculateResults = ({
    age,
    sex,
    weightMetric,
    weightImperial,
    heightMetric,
  }: StatsType) => {
    /////////
    // BMI //
    /////////
    // Not particular useful number, included for use in Heritage equation
    const bmi = weightMetric! / Math.pow(heightMetric! / 100, 2)
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
                0.15456 * Math.log10(heightMetric!)) -
            450
          : // female calc off?
            495 /
              (1.29579 -
                0.35004 * Math.log10(waist * 2.54 + hips * 2.54 - neck * 2.54) +
                0.221 * Math.log10(heightMetric!)) -
            450
        : // Imperial formula
          sex === 'M'
          ? 86.01 * Math.log10(waist - neck) -
            70.041 * Math.log10(height) +
            36.76
          : 163.205 * Math.log10(waist + hips - neck) -
            97.684 * Math.log10(height) -
            78.387

    // Covert Bailey Formula
    // Imperial formula
    const covertBaileyCalc =
      sex === 'M'
        ? age! < 30
          ? waist + 0.5 * hips - 3 * forearm - wrist
          : waist + 0.5 * hips - 2.7 * forearm - wrist
        : age! < 30
          ? hips + 0.8 * thigh - 2 * calf - wrist
          : hips + thigh - 2 * calf - wrist

    // Heritage BMI to Body Fat Percentage Formula
    // may be off (or bmi may be off)? It is off from the hub pages persons report
    const heritageBfpCalc =
      sex === 'M'
        ? // (977.17 * weightImperial) / Math.pow(heightImperial, 2) +
          // 0.16 * age -
          // 19.34
          1.39 * bmi + 0.16 * age! - 19.34
        : 1.39 * bmi + 0.16 * age! - 9

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
          ? 0.407 * weightMetric! + 0.267 * heightMetric! - 19.2
          : 0.252 * weightMetric! + 0.473 * heightMetric! - 48.3
        : sex === 'M'
          ? (0.407 * weightMetric! + 0.267 * heightMetric! - 19.2) * 2.20462
          : (0.252 * weightMetric! + 0.473 * heightMetric! - 48.3) * 2.20462

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
        ? 10 * weightMetric! + 6.25 * heightMetric! - 5 * age! + 5
        : 10 * weightMetric! + 6.25 * heightMetric! - 5 * age! - 161

    // Katch-McArdle Formula
    const bmrKatchCalc = 370 + 21.6 * (weightMetric! * (1 - selectedBfp / 100))

    setBmrMifflin(bmrMifflinCalc)
    setBmrKatch(bmrKatchCalc)

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

  return (
    <main className="calories-page">
      <h1>FitMatrix</h1>
      <div className="calories-container">
        <button onClick={toggleUnit}>
          Switch to {unit === 'metric' ? 'Imperial' : 'Metric'}
        </button>
        <form onSubmit={handleFormSubmit}>
          <p className="form-input">
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
            />
          </p>
          <p className="form-input">
            <label htmlFor="sex">Sex: </label>
            <select name="sex" value={sex || ''} onChange={handleInputChange}>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </p>
          <p className="form-input">
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
          </p>
          <p className="form-input">
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
          <p>
            <input type="submit" value="Submit" />
          </p>
        </form>
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

export default SignedOutTdee
