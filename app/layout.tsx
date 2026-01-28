import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UpperCircuit - Indian Stock Backtesting',
  description: 'Backtest your trading strategies using natural language',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
