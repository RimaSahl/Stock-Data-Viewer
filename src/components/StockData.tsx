import React, { useState, useEffect, useCallback} from "react";
import StockChart from "./StockChart";
import { fetchStockData } from "../utils/api";

const StockData: React.FC = () => {
  const [stockData, setStockData] = useState<
    {
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }[]
  >([]);
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [interval, setInterval] = useState<string>("1min");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced value for symbol
  const [debouncedSymbol, setDebouncedSymbol] = useState<string>(symbol);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSymbol(symbol);
    }, 1000); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [symbol]);

  const getStockData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset previous errors
    try {
      const timeSeries = await fetchStockData(debouncedSymbol, interval);
      if (timeSeries) {
        const formattedData = Object.keys(timeSeries)
          .map((date) => ({
            date,
            open: parseFloat(timeSeries[date]["1. open"]),
            high: parseFloat(timeSeries[date]["2. high"]),
            low: parseFloat(timeSeries[date]["3. low"]),
            close: parseFloat(timeSeries[date]["4. close"]),
            volume: parseFloat(timeSeries[date]["5. volume"]),
          }))
          .slice(0, 30);
        setStockData(formattedData);
      }
    } catch (error: any) {
      setError(
        error.message || "Failed to fetch stock data. Please try again."
      );
      console.error("Error fetching stock data:", error);
      setStockData([]);
    } finally {
      setLoading(false);
    }
  },[interval, debouncedSymbol]);

  const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value);
  };

  const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(event.target.value);
  };

  const handleGetData = () => {
    getStockData();
  };

  useEffect(() => {
    if (debouncedSymbol) {
      getStockData();
    }
  }, [interval, debouncedSymbol, getStockData]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Stock Data Viewer</h1>
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={symbol}
          onChange={handleSymbolChange}
          className="border border-gray-300 p-2 rounded mr-2 w-36"
          placeholder="Symbol (e.g., AAPL)"
        />
        <select
          value={interval}
          onChange={handleIntervalChange}
          className="border border-gray-300 p-2 rounded mr-2"
        >
          <option value="1min">1 Minute</option>
          <option value="30min">30 Minutes</option>
          <option value="60min">60 Minutes</option>
        </select>
        <button
          onClick={handleGetData}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Stock Data"}
        </button>
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {stockData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Latest Stock Data for {debouncedSymbol}
          </h2>
          <StockChart data={stockData} />
        </div>
      )}
    </div>
  );
};

export default StockData;