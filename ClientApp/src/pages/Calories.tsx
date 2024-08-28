import React, { useState } from 'react'

const Calories = () => {
  // needs to get the user Stats for these calculations. Will use stubs for now
  // Stats
  let heightImperial = 69
  let heightMetric = Math.round((heightImperial / 0.3937007874) * 100) / 100
  let weightImperial = 208
  let weightMetric = Math.round((weightImperial / 2.2046226218) * 100) / 100
  let age = 29
  let sex = 'M'
  let activityLevel = 1.2
  let calories1 = 2000
  let bodyFatPercent = 0
  let tdeeCalc = 0
  let steps = 0
  let measureSystem =
    //
    // 'metric'
    'imperial'

  // Measurements
  let waist = 40
  let neck = 16.5
  let hips = 52
  let forearm = 11.5
  let wrist = 6.5
  let thigh = 25
  let calf = 15

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('TDEE')
  const [weight, setWeight] = useState(weightMetric)
  const [calories, setCalories] = useState(calories1)
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    calculateResults()
    setIsSubmitted(true)
  }

  const calculateResults = () => {
    /////////
    // BMI //
    /////////
    // Not particular useful number, included for use in Heritage equation
    const bmi = weightMetric / Math.pow(heightMetric / 100, 2)
    setBmi(bmi)

    /////////////////////////
    // Body Fat Percentage //
    /////////////////////////

    // U.S. Navy Formula for Body Fat Percentage
    const navyBfpCalc =
      // Metric
      measureSystem === 'metric'
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
      sex === 'F'
        ? age < 30
          ? hips + 0.8 * thigh - 2 * calf - wrist
          : hips + thigh - 2 * calf - wrist
        : age < 30
          ? waist + 0.5 * hips - 3 * forearm - wrist
          : waist + 0.5 * hips - 2.7 * forearm - wrist

    // Heritage BMI to Body Fat Percentage Formula
    // may be off (or bmi may be off)? It is off from the hubpages persons report
    const bmiBfpCalc =
      sex === 'F'
        ? 1.39 * bmi + 0.16 * age - 9
        : // (977.17 * weightImperial) / Math.pow(heightImperial, 2) +
          // 0.16 * age -
          // 19.34
          1.39 * bmi + 0.16 * age - 19.34

    // YMCA Body Fat Percentage Formula
    const ymcaBfpCalc =
      sex === 'M'
        ? ((4.15 * waist - 0.082 * weightImperial - 98.42) / weightImperial) *
          100
        : ((4.15 * waist - 0.082 * weightImperial - 76.76) / weightImperial) *
          100

    // Modified YMCA Body Fat Percentage Formula
    const modYmcaBfpCalc =
      sex === 'M'
        ? ((-0.082 * weightImperial + 4.15 * waist - 94.42) / weightImperial) *
          100
        : ((0.268 * weightImperial -
            0.318 * wrist +
            0.157 * waist +
            0.245 * hips -
            0.434 * forearm -
            8.987) /
            weightImperial) *
          100

    const averageBfpCalc =
      (navyBfpCalc +
        covertBaileyCalc +
        bmiBfpCalc +
        ymcaBfpCalc +
        modYmcaBfpCalc) /
      5

    setNavyBfp(navyBfpCalc)
    setCovertBailey(covertBaileyCalc)
    setBmiBfp(bmiBfpCalc)
    setYmcaBfp(ymcaBfpCalc)
    setModYmcaBfp(modYmcaBfpCalc)
    setAverageBfp(averageBfpCalc)

    ////////////////////////////////
    // Lean Body Mass Estimations //
    ////////////////////////////////

    // Calculated Lean Body Mass using recorded weight and Navy Method's result
    const selectedBfp = bodyFatPercent === 0 ? navyBfpCalc : bodyFatPercent
    let lbmKatchCalc = weightImperial * (1 - selectedBfp / 100)

    // Boer formula for obese individuals with a BMI between 35 and 40
    let lbmBoerCalc =
      sex === 'M'
        ? 0.407 * weightMetric + 0.267 * heightMetric - 19.2
        : 0.252 * weightMetric + 0.473 * heightMetric - 48.3

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
    setLbmBoer(measureSystem === 'metric' ? lbmBoerCalc * 2.20462 : lbmBoerCalc)

    //////////////////////
    // BMR Calculations //
    //////////////////////

    // Mifflin St Jeor Formula
    let bmrMifflinCalc =
      sex === 'M'
        ? 10 * weightMetric + 6.25 * heightMetric - 5 * age + 5
        : 10 * weightMetric + 6.25 * heightMetric - 5 * age - 161

    // Katch-McArdle Formula
    const bmrKatchCalc = 370 + 21.6 * (weightMetric * (1 - selectedBfp / 100))

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
      (370 + 21.6 * (weightMetric * (1 - selectedBfp / 100))) * 1.11

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
        <div className="calories-input-container">
          {/* <div className="calories-input-stats">
            Enter today&apos;s weight:</div>
          </div> */}

          <form className="calories-input-container" onSubmit={handleSubmit}>
            <p className="form-input">
              <label htmlFor="weight">Enter today&apos;s weight:</label>
              {/* Remove name=input? */}
              <input
                type="number"
                name="weight input"
                placeholder="Weight"
                value={weight}
                onChange={(event) => setWeight(parseFloat(event.target.value))}
              />
            </p>
            {/* <p>
              <input type="submit" value="Submit" />
            </p> */}
            <p className="form-input">
              <label htmlFor="calories">
                Enter today&apos;s total calories:{' '}
                <span className="reminder">
                  Remember to measure RAW ingrediants
                </span>
              </label>
              <input
                type="number"
                name="calories input"
                placeholder="Calories"
                value={calories}
                onChange={(event) =>
                  setCalories(parseFloat(event.target.value))
                }
              />
            </p>
            <p>
              <input type="submit" value="Submit" />
            </p>
          </form>
        </div>

        <div className={`calories-user-stats ${isSubmitted ? 'show' : ''}`}>
          <div className="button-group">
            <button onClick={() => setSelectedFilter('TDEE')}>TDEE</button>
            <button onClick={() => setSelectedFilter('BMR')}>BMR</button>
            <button onClick={() => setSelectedFilter('LBM')}>LBM</button>
            <button onClick={() => setSelectedFilter('BF%')}>BF%</button>
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

export default Calories
