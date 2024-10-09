import React, { useEffect, useState } from 'react'
import numbers from './numbers.txt' // Ensure this path is correct

const MergeNumbers = () => {
  const [mergedNumbers, setMergedNumbers] = useState('')

  useEffect(() => {
    console.log(mergedNumbers)
  }, [mergedNumbers])

  useEffect(() => {
    const fetchAndMergeNumbers = async () => {
      try {
        const response = await fetch(numbers)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.text()
        const lines = data.trim().split('\n')

        const group1 = []
        const group2 = []
        const midPoint = Math.ceil(lines.length / 2)

        for (let i = 0; i < lines.length; i++) {
          const nums = lines[i].trim().split(/\s+/).map(Number)
          if (i < midPoint) {
            group1.push(...nums)
          } else {
            group2.push(...nums)
          }
        }

        const merged = []
        const maxLength = Math.max(group1.length, group2.length)

        for (let i = 0; i < maxLength; i++) {
          if (i < group1.length) merged.push(group1[i])
          if (i < group2.length) merged.push(group2[i])
        }

        setMergedNumbers(merged.join('\n'))
        downloadFile(merged)
      } catch (error) {
        console.error('Error fetching or processing file:', error)
      }
    }

    fetchAndMergeNumbers()
  }, [])

  const downloadFile = (merged: number[]) => {
    const blob = new Blob([merged.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'numberPage.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h1>Merged Numbers</h1>
      <pre>{mergedNumbers}</pre>
    </div>
  )
}

export default MergeNumbers
