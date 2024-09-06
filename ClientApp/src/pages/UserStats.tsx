import React from 'react'

import { Link } from 'react-router-dom'
// import { NullUser, NullUserStats, UserStatsType } from '../types/types'
// import { useQuery } from 'react-query'
import { getUser } from '../types/auth'

// async function loadOneUser(id: string) {
//   const response = await fetch(`/api/users/${id}`)

//   if (response.ok) {
//     return response.json()
//   } else {
//     throw await response.json()
//   }
// }

// async function loadUserStats(id: string) {
//   const response = await fetch(`/users/${id}`)

//   if (response.ok) {
//     return response.json()
//   } else {
//     throw await response.json()
//   }
// }

const UserStats = () => {
  const user = getUser()
  // console.log(user.stats)
  // const { id } = useParams() as { id: string }

  // const { data: userStats = NullUserStats } = useQuery<UserStatsType>(
  //   ['user-stats', id],
  //   () => loadUserStats(id)
  // )

  // console.log(user)
  return (
    <main className="user-page">
      <ul>
        <li>
          <h2>
            <Link to={`/users/${user.id}`}>{user.fullName}</Link>
          </h2>
          {/* <p>{user.stats?.age}</p>
          <p>{user.email}</p>
          <p>{user.stats?.sex}</p>
          <p>{user.stats?.height}</p>
          <p>{user.stats?.weight}</p> */}
          {/* <p>{user.stats?.goal}</p> */}
          {/* <p>{user.stats?.goalValue}</p> */}
        </li>
      </ul>
      <ul className="results">{}</ul>
    </main>
  )
}

export default UserStats
