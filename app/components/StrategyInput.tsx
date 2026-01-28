'use client'

import { useState } from 'react'

interface StrategyInputProps {
  onBacktest: (strategy: string, symbol: string, startDate: string, endDate: string) => void
  isLoading: boolean
}

export default function StrategyInput({ onBacktest, isLoading }: StrategyInputProps) {
  const [strategy, setStrategy] = useState('')
  const [symbol, setSymbol] = useState('RELIANCE')
  const [startDate, setStartDate] = useState('2023-01-01')
  const [endDate, setEndDate] = useState('2023-12-31')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (strategy.trim() && symbol.trim()) {
      onBacktest(strategy, symbol, startDate, endDate)
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        📝 Define Your Strategy
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="strategy" className="block text-sm font-semibold text-gray-700 mb-2">
            Trading Strategy (English/Hinglish)
          </label>
          <textarea
            id="strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="input-field min-h-32 resize-y"
            placeholder="Example: Buy when RSI is below 30 and sell when profit reaches 5% or loss exceeds 2%"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Describe your entry, exit, and stop-loss conditions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Symbol
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="input-field"
              placeholder="RELIANCE"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              NSE symbols (e.g., TCS, INFY, HDFCBANK)
            </p>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading || !strategy.trim() || !symbol.trim()}
        >
          {isLoading ? 'Running Backtest...' : '🚀 Run Backtest'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>💡 Pro Tip:</strong> Be specific about entry/exit conditions. 
          Include indicators (RSI, SMA, EMA) and percentage targets for best results.
        </p>
      </div>
    </div>
  )
}
