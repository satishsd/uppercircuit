'use client'

import { useState } from 'react'
import StrategyInput from './components/StrategyInput'
import BacktestResults from './components/BacktestResults'

interface BacktestResults {
  symbol: string
  totalTrades: number
  winRate: number
  totalReturn: number
  maxDrawdown: number
  sharpeRatio: number
  profitFactor: number
  trades: Array<{
    date: string
    type: 'BUY' | 'SELL'
    price: number
    quantity: number
    pnl?: number
  }>
  equityCurve: Array<{
    date: string
    equity: number
  }>
  fees: {
    stt: number
    sebiCharges: number
    gst: number
    total: number
  }
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BacktestResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleBacktest = async (strategy: string, symbol: string, startDate: string, endDate: string) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ strategy, symbol, startDate, endDate }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Backtest failed. Please check your inputs and try again.')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            🚀 UpperCircuit
          </h1>
          <p className="text-xl text-gray-600">
            Backtest Your Trading Strategies in Natural Language
          </p>
          <p className="text-sm text-gray-500 mt-2">
            English & Hinglish Supported | Indian Markets
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <StrategyInput onBacktest={handleBacktest} isLoading={isLoading} />
          </div>

          <div>
            {isLoading && (
              <div className="card">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <p className="text-center text-gray-600 mt-4">
                  Running backtest... This may take a moment
                </p>
              </div>
            )}

            {error && (
              <div className="card bg-red-50 border-2 border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {results && !isLoading && (
              <BacktestResults results={results} />
            )}

            {!isLoading && !error && !results && (
              <div className="card bg-blue-50 border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  📊 How it works
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Enter your strategy in plain English or Hinglish</li>
                  <li>✓ Select the stock symbol (e.g., RELIANCE, TCS, INFY)</li>
                  <li>✓ Choose your backtest date range</li>
                  <li>✓ Get detailed performance analytics with charts</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Example Strategies:</p>
                  <p className="text-sm text-gray-600">• "Buy when RSI &lt; 30 and sell when profit is 5%"</p>
                  <p className="text-sm text-gray-600">• "Jab 50 SMA cross kare tab buy karo aur 3% stop loss rakho"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
