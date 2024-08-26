import React, { useState } from 'react'

const Calories = () => {
  //needs to get the user Stats for these calculations. Will use stubs for now
  let heightMetric = 182.88
  let heightImperial = 72
  let weightMetric = 86.454706
  let weightImperial = 190.6
  let age = 48
  let sex = 'M'
  let activityLevel = 1.2
  let calories1 = 2000
  let bodyFatPercent = 21.5
  let tempLbmBoer = 0
  let tempLbmHume = 0
  let tempLbmJames = 0
  let bmrMifflinCalc = 0
  let tdeeCalc = 0
  let steps = 0

  // Measurements
  let waist = 37
  let neck = 15.5

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('TDEE')
  const [weight, setWeight] = useState(weightMetric)
  const [calories, setCalories] = useState(calories1)
  const [bmrMifflin, setBmrMifflin] = useState(0)
  const [bmrKatch, setBmrKatch] = useState(0)
  const [rmrMifflin, setRmrMifflin] = useState(0)
  const [rmrKatch, setRmrKatch] = useState(0)
  const [tdeeMifflin, setTdeeMifflin] = useState(0)
  const [tdeeKatch, setTdeeKatch] = useState(0)
  const [lbmBoer, setLbmBoer] = useState(0)
  const [lbmHume, setLbmHume] = useState(0)
  const [lbmJames, setLbmJames] = useState(0)
  const [navyBfp, setNavyBfp] = useState(0)
  const [bmiBfp, setBmiBfp] = useState(0)
  const [bmi, setBmi] = useState(0)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    calculateResults()
    setIsSubmitted(true)
  }

  const calculateResults = () => {
    // SOME (maybe ALL) Equations are in kg

    /////////////////////////
    // Body Fat Percentage //
    /////////////////////////
    // U.S. Navy Formula for Body Fat Percentage
    const navyBfpCalc =
      // Imperial // 86.01 * Math.log10(37 - 15.5) - 70.041 * Math.log10(72) + 36.76
      // Metric
      495 /
        (1.0324 -
          0.19077 * Math.log10(waist * 2.54 - neck * 2.54) +
          0.15456 * Math.log10(heightImperial * 2.54)) -
      450
    setNavyBfp(navyBfpCalc)

    /////////////////////////////////
    // Lean Body Mass Calculations //
    /////////////////////////////////
    // Boer formula for obese individuals with a BMI between 35 and 40
    if (sex === 'M') {
      tempLbmBoer = 0.407 * weightMetric + 0.267 * heightMetric - 19.2
      tempLbmHume = 0.3281 * weightMetric + 0.33929 * heightMetric - 29.5336
      tempLbmJames =
        1.1 * weightMetric - 128 * Math.pow(weightMetric / heightMetric, 2)
    } else {
      tempLbmBoer = 0.252 * weightMetric + 0.473 * heightMetric - 48.3
      tempLbmHume = 0.29569 * weightMetric + 0.41813 * heightMetric - 43.2933
      tempLbmJames =
        1.07 * weightMetric - 148 * Math.pow(weightMetric / heightMetric, 2)
    }
    // Convert from kg to pounds
    tempLbmBoer *= 2.20462
    tempLbmHume *= 2.20462
    tempLbmJames *= 2.20462
    setLbmBoer(tempLbmBoer)
    setLbmHume(tempLbmHume)
    setLbmJames(tempLbmJames)

    //////////////////////
    // BMR Calculations //
    //////////////////////
    // Mifflin St Jeor Formula
    bmrMifflinCalc = 10 * weightMetric + 6.25 * heightMetric - 5 * age
    if (sex === 'M') {
      bmrMifflinCalc += 5
    } else {
      bmrMifflinCalc -= 161
    }
    const rmrMifflinCalc = bmrMifflinCalc * 1.11
    // Katch-McArdle Formula
    const selectedBfp = bodyFatPercent === 0 ? navyBfpCalc : bodyFatPercent
    const bmrKatchCalc = 370 + 21.6 * (weightMetric * (1 - selectedBfp / 100))

    setBmrKatch(bmrKatchCalc)
    setBmrMifflin(bmrMifflinCalc)

    //////////////////
    // RDEE and RMR //
    //////////////////
    // Mifflin St Jeor Formula
    // const rmrMifflinCalc =
    // (9.99 * weightMetric + 6.25 * heightMetric - 4.92 * age + 5) * 1.11
    // Katch-McArdle Formula
    const rmrKatchCalc =
      (370 + 21.6 * (weightMetric * (1 - selectedBfp / 100))) * 1.11
    setRmrMifflin(rmrMifflinCalc)
    setRmrKatch(rmrKatchCalc)

    ///////////////////////
    // TDEE Calculations //
    ///////////////////////
    const tdeeMifflinCalc = bmrMifflinCalc * activityLevel
    const tdeeKatchCalc = bmrKatchCalc * activityLevel
    setTdeeMifflin(tdeeMifflinCalc)
    setTdeeKatch(tdeeKatchCalc)

    /////////
    // BMI //
    /////////
    const bmi = weightMetric / Math.pow(heightMetric / 100, 2)
    setBmi(bmi)
    const bmiBfpCalc = 1.2 * bmi + 0.23 * age - 10.8 * 1 - 5.4
    setBmiBfp(bmiBfpCalc)
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
                Enter today&apos;s total calories:
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
                <div className="result-label">RMR (Mifflin St. Jeor):</div>
                <div className="result-value"> {rmrMifflin.toFixed(0)} </div>
              </div>
              <div className="result-row">
                <div className="result-label">RMR (Katch-McArdle):</div>
                <div className="result-value"> {rmrKatch.toFixed(0)} </div>
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
                <div className="result-value">
                  {(weightImperial * (1 - bodyFatPercent / 100)).toFixed(1)}
                </div>
              </div>
              <div className="result-row">
                <div className="result-label">Lean Body Mass (Boer):</div>
                <div className="result-value"> {lbmBoer.toFixed(1)}</div>
              </div>
              <div className="result-row">
                <div className="result-label">Lean Body Mass (James):</div>
                <div className="result-value"> {lbmJames.toFixed(1)}</div>
              </div>
              <div className="result-row">
                <div className="result-label">Lean Body Mass (Hume):</div>
                <div className="result-value"> {lbmHume.toFixed(1)}</div>
              </div>
            </>
          ) : null}
          {selectedFilter === 'ALL' || selectedFilter === 'BF%' ? (
            <>
              <div className="result-row">
                <div className="result-label">BMI:</div>
                <div className="result-value"> {bmi.toFixed(1)}</div>
              </div>
              <div className="result-row">
                <div className="result-label">
                  Navy Method - Body Fat Percent:
                </div>
                <div className="result-value"> {navyBfp.toFixed(1)}%</div>
              </div>
              <div className="result-row">
                <div className="result-label">
                  Body Fat Percentage (based on BMI):
                </div>
                <div className="result-value"> {bmiBfp.toFixed(1)}%</div>
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
