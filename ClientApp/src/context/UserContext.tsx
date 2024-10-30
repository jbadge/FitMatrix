import React, { useContext, useEffect, useMemo, useState } from 'react'
import { NullUser, UserType } from '../types/types'
import useLoadUser from '../hooks/useLoadUser'
import { getUser } from '../types/auth'

type UserContextType = {
  userState: UserType
  setUserState: React.Dispatch<React.SetStateAction<UserType>>
}

export const UserContext = React.createContext<UserContextType>(
  {} as UserContextType
)

type Props = {
  children: React.ReactNode
}

export const UserContextProvider = ({ children }: Props) => {
  const [userState, setUserState] = useState<UserType>(NullUser)

  const userId = getUser().id.toString()

  const { user, isUserLoading } = useLoadUser(userId)

  useEffect(() => {
    if (!isUserLoading && user) {
      setUserState(user)
    }
  }, [user, isUserLoading])

  const memoizedUserContext = useMemo(() => {
    return { userState, setUserState }
  }, [userState, setUserState])

  return (
    <UserContext.Provider value={memoizedUserContext}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const userContext = useContext(UserContext)

  if (!userContext)
    throw new Error('You need to use this context inside a Provider')

  return userContext
}
