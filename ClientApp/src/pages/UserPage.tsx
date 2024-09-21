import React from 'react'

import { Link, useParams } from 'react-router-dom'
// import { NullUser, NullUserStats, UserStatsType } from '../types/types'
// import { useQuery } from 'react-query'
// import { getUser } from '../types/auth'
// import { NullUserStats, StatsType } from '../types/types'
// import { useQuery } from 'react-query'

// async function loadUserStats(id: string) {
//   const response = await fetch(`/api/Users/${id}`)

//   if (response.ok) {
//     return response.json()
//   } else {
//     throw await response.json()
//   }
// }

const UserPage = () => {
  // const user = getUser()
  // console.log(user)
  const { id } = useParams() as { id: string }
  // const [unit, setUnit] = useState('imperial')

  // const {
  //   // refetch: reloadUser,
  //   data: userStats = NullUserStats,
  // } = useQuery<StatsType>(['user-stats', id], () => loadUserStats(id))

  // const toggleUnit = () => {
  //   setUnit((prevUnit) => {
  //     const newUnit = prevUnit === 'metric' ? 'imperial' : 'metric'

  //     // setProgress((prevInput) => {
  //     //   const newWeightMetric =
  //     //     newUnit === 'metric'
  //     //       ? prevInput.weightMetric!
  //     //       : convertToMetric(prevInput.weightImperial!)
  //     //   const newWeightImperial =
  //     //     newUnit === 'imperial'
  //     //       ? prevInput.weightImperial!
  //     //       : convertToImperial(prevInput.weightMetric!)
  //     //   const date = new Date()
  //     //   setWeight(newUnit === 'metric' ? newWeightMetric : newWeightImperial)

  //     //   return {
  //     //     dateOfEntry: date,
  //     //     weightMetric: newWeightMetric,
  //     //     weightImperial: newWeightImperial,
  //     //     calories: calories,
  //     //   }
  //     // })
  //     return newUnit
  //   })
  // }

  // const createNewReview = useMutation(submitNewReview, {
  //   onSuccess: function () {
  //     reloadUserStats()

  //     setNewReview({
  //       ...newReview,
  //       body: '',
  //       stars: 5,
  //       summary: '',
  //     })
  //   },
  // })

  return (
    <main className="user-page">
      <h1>FitMatrix</h1>
      <div className="user-container">
        <ul>
          {/* Add later to edit name, email
          <li>
            <Link to={`/users/${user.id}`}>Account Settings</Link>
          </li> */}
          <li>
            {/* Make it so it remembers and loads data */}
            <Link to={`/users/${id}/info`}>Profile Settings</Link>
          </li>
          <li>
            {/* Need something for editing an old progress entry */}
            <Link to={`/users/${id}/Progress`}>Add a new progress entry</Link>
          </li>
        </ul>
      </div>
    </main>
  )
}

export default UserPage
