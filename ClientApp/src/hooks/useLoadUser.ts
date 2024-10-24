import { useQuery } from 'react-query'
import { getUserById } from '../types/auth'
import { NullUser } from '../types/types'

const useLoadUser = (id: string) => {
  const {
    data: user = NullUser,
    isLoading: isUserLoading,
    // refetch: refetchUser,
  } = useQuery(['user', id], () => getUserById(id!), {})

  console.log(`Fetching user data for ID: ${id}`)
  return { user, isUserLoading }
}

export default useLoadUser
