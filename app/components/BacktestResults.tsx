'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BacktestResultsProps {
  results: {
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
}

export default function BacktestResults({ results }: BacktestResultsProps) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          📊 Backtest Results - {results.symbol}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Return</p>
            <p className={`text-2xl font-bold ${results.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {results.totalReturn.toFixed(2)}%
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-gray-800">
              {results.winRate.toFixed(1)}%
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Trades</p>
            <p className="text-2xl font-bold text-gray-800">
              {results.totalTrades}
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Max Drawdown</p>
            <p className="text-2xl font-bold text-red-600">
              {results.maxDrawdown.toFixed(2)}%
            </p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Sharpe Ratio</p>
            <p className="text-2xl font-bold text-gray-800">
              {results.sharpeRatio.toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-pink-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Profit Factor</p>
            <p className="text-2xl font-bold text-gray-800">
              {results.profitFactor.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Equity Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.equityCurve} aria-label="Portfolio equity curve over time">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="equity" stroke="#1a73e8" strokeWidth={2} name="Portfolio Value (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Indian Market Fees</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">STT</p>
              <p className="text-lg font-semibold">₹{results.fees.stt.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">SEBI Charges</p>
              <p className="text-lg font-semibold">₹{results.fees.sebiCharges.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">GST</p>
              <p className="text-lg font-semibold">₹{results.fees.gst.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded">
              <p className="text-xs text-gray-600">Total Fees</p>
              <p className="text-lg font-semibold text-blue-700">₹{results.fees.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Trade Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Trading history with buy and sell transactions">
            <caption className="sr-only">Complete trade log showing all buy and sell transactions with profit and loss</caption>
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-2 text-left">Date</th>
                <th scope="col" className="px-4 py-2 text-left">Type</th>
                <th scope="col" className="px-4 py-2 text-right">Price</th>
                <th scope="col" className="px-4 py-2 text-right">Quantity</th>
                <th scope="col" className="px-4 py-2 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {results.trades.map((trade, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{trade.date}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      trade.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">₹{trade.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{trade.quantity}</td>
                  <td className={`px-4 py-2 text-right font-semibold ${
                    trade.pnl && trade.pnl > 0 ? 'text-green-600' : trade.pnl && trade.pnl < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {trade.pnl ? `₹${trade.pnl.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
