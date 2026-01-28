# UpperCircuit - Indian Stock Backtesting Platform

A web application for Indian stock traders to backtest trading strategies using Natural Language.

## Features

- Natural language strategy input (English/Hinglish)
- AI-powered strategy parsing using OpenAI
- Historical data from Angel One SmartAPI
- Professional backtesting analytics
- Indian market-specific calculations (STT, SEBI charges, GST)

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **LLM**: OpenAI GPT-4o-mini
- **Data**: Angel One SmartAPI
- **Charts**: Recharts

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_key
   ANGEL_ONE_API_KEY=your_angel_one_key
   ANGEL_ONE_CLIENT_ID=your_client_id
   ```
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Example Strategies

- "Buy SBI if RSI < 30 on daily chart and exit when profit is 5%"
- "RELIANCE ko buy karo jab 50 SMA cross kare aur stop loss 3%"

## License

MIT