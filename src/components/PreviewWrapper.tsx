
'use client'

import { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface PreviewWrapperProps {
  children: ReactNode
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="error-boundary p-4 border border-red-300 bg-red-50 rounded-lg">
      <h2 className="text-red-800 font-semibold mb-2">Something went wrong:</h2>
      <pre className="text-red-600 text-sm">{error.message}</pre>
    </div>
  )
}

export default function PreviewWrapper({ children }: PreviewWrapperProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="preview-container">
        {children}
      </div>
    </ErrorBoundary>
  )
}

