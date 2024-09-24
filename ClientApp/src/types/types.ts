export type SexOptionsType = 'M' | 'F' | 'U'

export type GoalOptionsType = 'lose' | 'gain' | 'maintain'

export type ActivityLevelType =
  | 'None'
  | 'Sedentary'
  | 'Light'
  | 'Moderate'
  | 'Heavy'
  | 'Athlete'

export type APIError = {
  errors: Record<string, string[]>
  status: number
  title: string
  traceId: string
  type: string
}

export type NewUserType = {
  id?: number
  fullName: string
  email: string
  password: string
  stats: [] | undefined
  goal: [] | undefined
  progress: [] | undefined
}

export type UserType = {
  id?: number
  fullName: string
  email: string
  stats: [] | undefined
  goal: [] | undefined
  progress: [] | undefined
}

export type StatsType = {
  userId?: number
  age: number
  doB?: Date
  sex?: SexOptionsType
  heightMetric: number
  heightImperial: number
  weightMetric: number
  weightImperial: number
  activityLevel?: number
  activityLevelLabel?: ActivityLevelType
  bodyFatPercent?: number
}

export type GoalType = {
  userId?: number
  goalSelection?: GoalOptionsType
  goalWeight?: number
  goalRate?: number
  goalBfp?: number
  goalDate?: Date
}

export type ProgressType = {
  userId?: number
  dateOfEntry?: Date
  progressWeightMetric?: number
  progressWeightImperial?: number
  calories?: number
  bodyFatPercent?: number
}

export type LoginUserType = {
  email: string
  password: string
}

export type LoggedInUser = {
  id: number
  fullName: string
  email: string
  stats: StatsType[] | undefined
  goal: GoalType[] | undefined
  progress: ProgressType[] | undefined
}

export type LoginSuccess = {
  token: string
  user: LoggedInUser
}

export const NullUser: UserType = {
  id: 0,
  fullName: '',
  email: '',
  stats: undefined,
  goal: undefined,
  progress: undefined,
}

export const NullUserStats: StatsType = {
  doB: new Date(),
  age: 0,
  sex: 'U',
  heightMetric: 0,
  heightImperial: 0,
  weightMetric: 0,
  weightImperial: 0,
}
