
interface TimeSeriesData {
  [key: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
}

const BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = 'RIBXT3XYLI69PC0Q ';

export const fetchStockData = async (symbol: string, interval: string): Promise<TimeSeriesData | null> => {
  const response = await fetch(`${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`);
  
  if (!response.ok) throw new Error('Network response was not ok');
  
  const data = await response.json();
  
  // Check if the response is an object and contains the expected structure
  if (typeof data === 'object' && data !== null && data['Meta Data']) {
    return data["Time Series (1min)"] || data["Time Series (30min)"] || data["Time Series (60min)"] as TimeSeriesData;
  } else {
    throw new Error('Invalid data format received from API');
  }
};