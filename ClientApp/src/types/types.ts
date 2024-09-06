export type SexOptionsType = 'M' | 'F'

export type GoalOptionsType = 'lose' | 'gain' | 'maintain'

export type ActivityLevelType =
  | 'Sedentary'
  | 'None'
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

  stats: StatsType
  goal: GoalType
  progress: ProgressType
}

export type UserType = {
  id?: number
  fullName: string
  email: string
  stats: StatsType
  goal?: GoalType
  progress?: ProgressType
}

export type StatsType = {
  id?: number
  userId?: number
  age?: number
  sex?: SexOptionsType
  heightMetric?: number
  heightImperial?: number
  weightMetric?: number
  weightImperial?: number
  activityLevel?: number
  activityLevelLabel?: ActivityLevelType
}

export type GoalType = {
  id?: number
  userId?: number
  goalSelection?: GoalOptionsType
  goalWeight?: number
  goalRate?: number
  goalBfp?: number
  goalDate?: Date
}

export type ProgressType = {
  id?: number
  userId?: number
  dateOfEntry?: Date
  weightMetric?: number
  weightImperial?: number
  calories?: number
}

export type LoginUserType = {
  email: string
  password: string
}

export type LoggedInUser = {
  id: number
  fullName: string
  email: string
  // stats?: StatsType
  // goal?: GoalType
  // progress?: ProgressType
}

export type LoginSuccess = {
  token: string
  user: LoggedInUser
}

export const NullUser: UserType = {
  id: 0,
  fullName: '',
  email: '',
  stats: {
    sex: 'M',
    heightMetric: 0,
    heightImperial: 0,
    weightMetric: 0,
    weightImperial: 0,
    activityLevel: 1.2,
    activityLevelLabel: 'Sedentary',
  },
  goal: {},
  progress: {
    weightMetric: 0,
    weightImperial: 0,
    calories: 0,
  },
}

export const NullUserStats: StatsType = {
  sex: 'M',
  heightMetric: 0,
  heightImperial: 0,
  weightMetric: 0,
  weightImperial: 0,
}
