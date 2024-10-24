import React, { useState } from 'react'

import { YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { ProgressType } from '../types/types'
import { authHeader } from '../types/auth'

const HistoryAreaGraph = ({ id, unit }: ProgressType & { unit: string }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [firstValue, setFirstValue] = useState(0)
  const [lastValue, setLastValue] = useState(0)

  const [progressEntries, setProgressEntries] = useState<ProgressType[]>([])
  const dataKey =
    unit === 'imperial' ? 'progressWeightImperial' : 'progressWeightMetric'
  const colorChart =
    progressEntries[0]?.progressWeightImperial! >
    progressEntries.at(-1)?.progressWeightImperial!
      ? '#e84f50'
      : '#1c9860'

  function findMinWeight(arrayOfObjects: any): number | undefined {
    if (arrayOfObjects.length === 0) {
      return undefined
    }

    unit === 'imperial'
      ? setFirstValue(arrayOfObjects[0].progressWeightImperial)
      : setFirstValue(arrayOfObjects[0].progressWeightMetric)
  }

  function findMaxWeight(arrayOfObjects: any): number | undefined {
    if (arrayOfObjects.length === 0) {
      return undefined
    }

    console.log(unit, arrayOfObjects.at(-1).progressWeightImperial)
    unit === 'imperial'
      ? setLastValue(arrayOfObjects.at(-1).progressWeightImperial)
      : setLastValue(arrayOfObjects.at(-1).progressWeightMetric)
  }

  React.useEffect(() => {
    // let isMounted = true
    console.log(unit)
    async function fetchProgress() {
      try {
        const response = await fetch(`/api/Users/${id}`, {
          headers: {
            Authorization: authHeader(),
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (response.ok) {
          // && isMounted) {
          const user = await response.json()
          if (!user) return

          let progressEntryArray: ProgressType[] = user.progress || []
          setProgressEntries(progressEntryArray)
          setIsDataLoaded(true)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchProgress()

    // return () => {
    //   isMounted = false
    // }
  }, [])

  React.useEffect(() => {
    findMinWeight(progressEntries)
    findMaxWeight(progressEntries)
  }, [progressEntries])

  return (
    <ResponsiveContainer width={350} height={150}>
      {isDataLoaded ? (
        <AreaChart
          data={progressEntries}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient
              id={`color${colorChart}`}
              x1={0}
              y1={0}
              x2={0}
              y2={1}
            >
              <stop offset={'25%'} stopColor={colorChart} stopOpacity={0.4} />
              <stop offset={'75%'} stopColor={colorChart} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={colorChart}
            fill={`url(#color${colorChart})`}
            format={'number'}
          />
          <YAxis hide domain={[firstValue, lastValue]} />
        </AreaChart>
      ) : (
        <></>
      )}
    </ResponsiveContainer>
  )
}

export default HistoryAreaGraph
