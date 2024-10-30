import { useQuery } from 'react-query'
import { getUserById } from '../types/auth'
import { NullUser } from '../types/types'

const useLoadUser = (id: string) => {
  const { data: user = NullUser, isLoading: isUserLoading } = useQuery(
    ['user', id],
    () => getUserById(id!),
    {}
  )

  console.log(`Fetching user data for ID: ${id}`)
  // console.log(user)
  return { user, isUserLoading }
}

export default useLoadUser
