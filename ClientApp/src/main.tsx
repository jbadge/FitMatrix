import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import './index.scss'
import { App } from './App'

const queryClient = new QueryClient()

const disableReactDevTools = (): void => {
  const noop = (): void => undefined
  const DEV_TOOLS = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__

  if (typeof DEV_TOOLS === 'object') {
    for (const [key, value] of Object.entries(DEV_TOOLS)) {
      DEV_TOOLS[key] = typeof value === 'function' ? noop : null
    }
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// disableReactDevTools()
root.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
)
