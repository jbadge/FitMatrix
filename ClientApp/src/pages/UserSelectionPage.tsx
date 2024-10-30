import React from 'react'

import { Link, useParams } from 'react-router-dom'

const UserSelectionPage = () => {
  const { id } = useParams() as { id: string }

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
          <li>
            {/* Need something for editing an old progress entry */}
            <Link to={`/users/${id}/Measurements`}>Add new measurements</Link>
          </li>
        </ul>
      </div>
    </main>
  )
}

export default UserSelectionPage
