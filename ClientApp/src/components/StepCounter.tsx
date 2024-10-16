import React, { useState } from 'react'

const StepCounter = () => {
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()

      // Regex to capture sourceName, startDate, endDate, and value
      const regex =
        /<Record[^>]*sourceName="([^"]*)"[^>]*startDate="([^"]*)"[^>]*endDate="([^"]*)"[^>]*value="([^"]*)"[^>]*\/>/g
      let match

      type StepData = {
        start: string
        end: string
        value: number
      }

      const stepsBySource: { [key: string]: StepData[] } = {
        Watch: [],
        iBadger: [],
      }

      const targetDate = '2024-08-04' // Define the target date

      while ((match = regex.exec(text)) !== null) {
        const sourceName = match[1] // Extract source name
        const startDateTime = match[2] // Extract start date and time
        const endDateTime = match[3] // Extract end date and time
        const value = parseInt(match[4], 10) // Get step count value

        // Only aggregate for the specified date (August 4, 2024)
        if (
          startDateTime.startsWith(targetDate) &&
          (sourceName === 'Watch' || sourceName === 'iBadger')
        ) {
          stepsBySource[sourceName].push({
            start: startDateTime,
            end: endDateTime,
            value,
          })
        }
      }

      // Prepare output for CSV
      const output = ['Source,Start Date,End Date,Value', 'Watch Entries']
      let watchTotal = 0

      stepsBySource.Watch.forEach(({ start, end, value }) => {
        output.push(`Watch,${start},${end},${value}`)
        watchTotal += value // Calculate total for Watch
      })

      output.push(`,,Total for Watch,${watchTotal}`) // Add total for Watch
      output.push('') // Add a blank line for separation
      output.push('iBadger Entries')
      let ibadgerTotal = 0

      stepsBySource.iBadger.forEach(({ start, end, value }) => {
        output.push(`iBadger,${start},${end},${value}`)
        ibadgerTotal += value // Calculate total for iBadger
      })

      output.push(`,,Total for iBadger,${ibadgerTotal}`) // Add total for iBadger

      // Generate CSV for download
      const blob = new Blob([output.join('\n')], {
        type: 'text/csv;charset=utf-8;',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.setAttribute('download', 'step_entries_aug_4_2024.csv')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      setError('Error processing the file: ' + (err as Error).message)
    }
  }

  return (
    <div>
      <h1>Step Counter XML to CSV</h1>
      <input type="file" accept=".xml" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default StepCounter
