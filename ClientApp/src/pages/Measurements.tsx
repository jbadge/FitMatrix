import React from 'react'

const Measurements = () => {
  // Measurements
  /////////////////////////////////////////////////
  // Need to record these measurements for the user
  // const waist = 37
  // const neck = 14.5
  // const hips = 39
  // const forearm = 11.625
  // const wrist = 6.625
  // const thigh = 25
  // const calf = 15
  // const [unit, setUnit] = useState('imperial')

  // const toggleUnit = () => {
  //   setUnit((prevUnit) => {
  //     const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric'

  //     setGoalInfo((prev) => {
  //       const newGoalWeightMetric =
  //         newUnit === 'metric'
  //           ? convertWeightToMetric(prev.goalWeight!)
  //           : prev.goalWeight!

  //       const newGoalWeightImperial =
  //         newUnit === 'metric'
  //           ? prev.goalWeight!
  //           : convertWeightToImperial(prev.goalWeight!)
  //       setGoalWeight(
  //         newUnit === 'metric' ? newGoalWeightMetric : newGoalWeightImperial
  //       )
  //       return {
  //         ...prev,
  //         goalWeight:
  //           newUnit === 'metric' ? newGoalWeightMetric : newGoalWeightImperial,
  //       }
  //     })

  //     setStatsInfo((prev) => {
  //       const newHeightMetric =
  //         newUnit === 'metric'
  //           ? prev.heightMetric!
  //           : convertHeightToMetric(prev.heightImperial!)
  //       const newHeightImperial =
  //         newUnit === 'imperial'
  //           ? prev.heightImperial!
  //           : convertHeightToImperial(prev.heightMetric!)
  //       const newWeightMetric =
  //         newUnit === 'metric'
  //           ? prev.weightMetric!
  //           : convertWeightToMetric(prev.weightImperial!)
  //       const newWeightImperial =
  //         newUnit === 'imperial'
  //           ? prev.weightImperial!
  //           : convertWeightToImperial(prev.weightMetric!)

  //       setHeight(newUnit === 'metric' ? newHeightMetric : newHeightImperial)
  //       setWeight(newUnit === 'metric' ? newWeightMetric : newWeightImperial)

  //       return {
  //         ...prev,
  //         heightMetric: newHeightMetric,
  //         heightImperial: newHeightImperial,
  //         weightMetric: newWeightMetric,
  //         weightImperial: newWeightImperial,
  //       }
  //     })
  //     return newUnit
  //   })
  // }
  return (
    <main className="user-page">
      <h1>FitMatrix</h1>
      <h2>Body for return is in Todo.txt</h2>
    </main>
  )
}

export default Measurements
