import React, { useState } from 'react'

const GoalSlider = () => {
  const [goalWeight, setGoalWeight] = useState<number | string>(0)

  return (
    <div>
      <label htmlFor="goal-weight" className="slider-label"></label>
      <input
        className="goal-weight"
        type="range"
        id="goal-weight"
        name="goal-weight"
        min="0"
        max="2"
        value={goalWeight}
        onChange={(event) => setGoalWeight(event.target.value)}
      />
    </div>
  )
}

export default GoalSlider
