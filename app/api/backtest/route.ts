import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI (will use OPENAI_API_KEY from environment)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

interface Trade {
  date: string
  type: 'BUY' | 'SELL'
  price: number
  quantity: number
  pnl?: number
}

export async function POST(request: Request) {
  try {
    const { strategy, symbol, startDate, endDate } = await request.json()

    // Validate inputs
    if (!strategy || !symbol || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse strategy using OpenAI (if available)
    let parsedStrategy = null
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a trading strategy parser. Parse the user's natural language strategy into structured JSON format with entry, exit, and stopLoss conditions. Return ONLY valid JSON with no additional text.
              
Example output:
{
  "entry": {
    "indicator": "RSI",
    "condition": "below",
    "value": 30
  },
  "exit": {
    "profitTarget": 5,
    "stopLoss": 2
  }
}`
            },
            {
              role: 'user',
              content: strategy
            }
          ],
          temperature: 0.3,
        })

        const content = completion.choices[0].message.content
        if (content) {
          parsedStrategy = JSON.parse(content)
        }
      } catch (error) {
        console.error('OpenAI parsing error:', error)
        // Continue with mock data if OpenAI fails
      }
    }

    // Generate mock historical data and run backtest
    const backtestResults = runBacktest(symbol, startDate, endDate, parsedStrategy || strategy)

    return NextResponse.json(backtestResults)
  } catch (error) {
    console.error('Backtest error:', error)
    return NextResponse.json(
      { error: 'Failed to run backtest' },
      { status: 500 }
    )
  }
}

function runBacktest(symbol: string, startDate: string, endDate: string, strategy: any) {
  // Generate mock price data
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  
  // Mock initial price
  const basePrice = 2000 + Math.random() * 1000
  
  // Generate daily prices with some volatility
  const priceData: { date: string; price: number; rsi: number }[] = []
  let currentPrice = basePrice
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    const dailyChange = (Math.random() - 0.48) * 0.03 // Slight upward bias
    currentPrice = currentPrice * (1 + dailyChange)
    
    // Mock RSI calculation (simplified)
    const rsi = 30 + Math.random() * 40
    
    priceData.push({
      date: date.toISOString().split('T')[0],
      price: currentPrice,
      rsi: rsi
    })
  }

  // Run backtest logic
  const trades: Trade[] = []
  let position: { buyPrice: number; quantity: number; buyDate: string } | null = null
  let capital = 100000 // Starting capital
  const equityCurve: { date: string; equity: number }[] = []
  
  let totalPnL = 0
  let wins = 0
  let losses = 0
  
  priceData.forEach((day, index) => {
    if (!position) {
      // Look for entry signal (simplified: RSI < 35)
      if (day.rsi < 35 && capital > day.price) {
        const quantity = Math.floor(capital * 0.9 / day.price) // Use 90% of capital
        position = {
          buyPrice: day.price,
          quantity: quantity,
          buyDate: day.date
        }
        
        trades.push({
          date: day.date,
          type: 'BUY',
          price: day.price,
          quantity: quantity
        })
        
        capital -= quantity * day.price
      }
    } else {
      // Look for exit signal (simplified: 5% profit or 2% loss)
      const pnlPercent = ((day.price - position.buyPrice) / position.buyPrice) * 100
      
      if (pnlPercent >= 5 || pnlPercent <= -2) {
        const sellValue = position.quantity * day.price
        const pnl = sellValue - (position.quantity * position.buyPrice)
        
        trades.push({
          date: day.date,
          type: 'SELL',
          price: day.price,
          quantity: position.quantity,
          pnl: pnl
        })
        
        capital += sellValue
        totalPnL += pnl
        
        if (pnl > 0) wins++
        else losses++
        
        position = null
      }
    }
    
    // Calculate current equity
    let equity = capital
    if (position) {
      equity += position.quantity * day.price
    }
    
    equityCurve.push({
      date: day.date,
      equity: equity
    })
  })

  // Calculate metrics
  const totalTrades = wins + losses
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0
  const totalReturn = ((equityCurve[equityCurve.length - 1].equity - 100000) / 100000) * 100
  
  // Calculate max drawdown
  let maxEquity = 100000
  let maxDrawdown = 0
  equityCurve.forEach(point => {
    if (point.equity > maxEquity) {
      maxEquity = point.equity
    }
    const drawdown = ((maxEquity - point.equity) / maxEquity) * 100
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  })

  // Calculate Indian market fees
  const totalTurnover = trades.reduce((sum, trade) => sum + (trade.price * trade.quantity), 0)
  const stt = totalTurnover * 0.00025 // 0.025% on sell side
  const sebiCharges = totalTurnover * 0.0000005 // Negligible
  const transactionCharges = totalTurnover * 0.0003 // 0.03%
  const gst = (sebiCharges + transactionCharges) * 0.18 // 18% GST
  const totalFees = stt + sebiCharges + gst

  // Simplified Sharpe ratio and profit factor
  const sharpeRatio = totalReturn > 0 ? (totalReturn / Math.max(maxDrawdown, 1)) : 0
  const totalProfit = trades.filter(t => t.pnl && t.pnl > 0).reduce((sum, t) => sum + (t.pnl || 0), 0)
  const totalLoss = Math.abs(trades.filter(t => t.pnl && t.pnl < 0).reduce((sum, t) => sum + (t.pnl || 0), 0))
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 10 : 0

  return {
    symbol,
    totalTrades,
    winRate,
    totalReturn,
    maxDrawdown,
    sharpeRatio,
    profitFactor,
    trades,
    equityCurve: equityCurve.filter((_, i) => i % Math.max(1, Math.floor(days / 50)) === 0), // Sample for chart
    fees: {
      stt,
      sebiCharges,
      gst,
      total: totalFees
    }
  }
}
