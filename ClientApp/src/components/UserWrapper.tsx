import React from 'react'
// import useLoadUser from '../hooks/useLoadUser'
import { Route, Routes } from 'react-router-dom'
// import { NullUser } from '../types/types'
// import { UserContext } from '../context/UserContext'
import UserSelectionPage from '../pages/UserSelectionPage'
import UserInfo from '../pages/UserInfo'
import Progress from '../pages/Progress'
import Measurements from '../pages/Measurements'

const UserWrapper = () => {
  // const { id } = useParams() as { id: string }
  // const { user } = useLoadUser(id!)
  // const userContext = useContext(UserContext)
  // console.log(userContext)
  // useEffect(() => {
  //   if (user && user !== NullUser) {
  //     // console.log('User data fetched:', user)
  //     userContext.setUserState(user)
  //   }
  // }, [user, userContext, userContext.setUserState])

  return (
    <Routes>
      <Route path="/" element={<UserSelectionPage />} />
      <Route path="/info" element={<UserInfo />} />
      <Route path="/Progress" element={<Progress />} />
      <Route path="/Measurements" element={<Measurements />} />
    </Routes>
  )
}

export default UserWrapper
