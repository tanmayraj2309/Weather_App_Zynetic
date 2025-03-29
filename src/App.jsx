"use client"

import { useEffect, useContext, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { ApiContext } from "./contexts/ApiContext"
import TemperatureDisplay from "./components/TemperatureDisplay"
import humidity from "./assets/image.png"
import wind from "./assets/wind.jpg"
import NotFound from "./components/NotFound"

const WeatherApp = () => {
  const {
    weather,
    forecast,
    loading,
    error,
    city,
    setCity,
    setSuggestions,
    history,
    fetchWeather,
    setTheme,
    suggestions,
    fetchSuggestions,
    theme,
  } = useContext(ApiContext)

  const [headerColor, setHeaderColor] = useState("text-blue-800") // Default color

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  
  // Change header color every 0.3 seconds
  useEffect(() => {
    const colors = ["text-blue-800", "text-green-600"];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setHeaderColor(colors[index]);
    }, 300); // Change interval to 300 milliseconds

    return () => clearInterval(interval);
  }, []);

  // Function to fetch weather based on user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const API_KEY = import.meta.env.VITE_API_KEY
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`

          try {
            const response = await axios.get(url)
            setCity(response.data.name)
            fetchWeather()
          } catch (err) {
            console.error("Error fetching weather:", err)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const handleHistoryClick = (city) => {
    setCity(city)
    fetchWeather()
  }

  // Get time of day to determine if it's day or night
  const getTimeOfDay = () => {
    if (!weather) return "day"
    const sunrise = weather.sys.sunrise * 1000
    const sunset = weather.sys.sunset * 1000
    const now = Date.now()
    return now > sunrise && now < sunset ? "day" : "night"
  }

  // Get weather background gradient based on weather condition and time
  const getWeatherBackground = () => {
    if (!weather) return "bg-gradient-to-br from-blue-400 to-blue-600"

    const timeOfDay = getTimeOfDay()
    const condition = weather.weather[0].main.toLowerCase()

    if (condition.includes("clear") && timeOfDay === "day") {
      return "bg-gradient-to-br from-blue-400 to-blue-600"
    } else if (condition.includes("clear") && timeOfDay === "night") {
      return "bg-gradient-to-br from-indigo-900 to-purple-900"
    } else if (condition.includes("cloud")) {
      return "bg-gradient-to-br from-gray-300 to-blue-400"
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return "bg-gradient-to-br from-gray-600 to-blue-700"
    } else if (condition.includes("thunderstorm")) {
      return "bg-gradient-to-br from-gray-800 to-indigo-900"
    } else if (condition.includes("snow")) {
      return "bg-gradient-to-br from-blue-100 to-blue-300"
    } else if (condition.includes("mist") || condition.includes("fog")) {
      return "bg-gradient-to-br from-gray-400 to-gray-600"
    } else {
      return "bg-gradient-to-br from-blue-400 to-blue-600"
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
      }`}
    >
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 bg-green-800 rounded-lg shadow-md">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
      <h1 className={`text-4xl font-extrabold mb-6 ${headerColor} 
          tracking-wider 
          shadow-lg 
          transition-transform 
          transform 
          hover:scale-105`}>
        Zynetic Forecast
      </h1>
      <form className="flex gap-2 w-full max-w-md" onSubmit={fetchWeather}>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              fetchSuggestions(e.target.value)
            }}
            className="w-full p-3 bg-gray-800 rounded-lg text-white shadow-md outline-none"
          />
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-gray-400 border border-gray-300 rounded-lg shadow-md mt-1 max-h-40 overflow-auto z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setCity(suggestion)
                    setSuggestions([])
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-800 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-500 shadow-md"
        >
          Search
        </button>
      </form>
      {history.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {history.map((item, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(item)}
              className="bg-gray-300 px-3 py-2 rounded-lg shadow-md text-gray-800 hover:bg-gray-400 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
      {loading && (
        <motion.div
          className="mt-4 text-lg"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
        >
          <img
            className="w-20 h-20 animate-spin"
            src="https://www.svgrepo.com/show/474682/loading.svg"
            alt="Loading icon"
          />
        </motion.div>
      )}
      {error && (
        <div>
          <NotFound />
          <p className="mt-4 text-red-500">{error}</p>
        </div>
      )}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 w-full max-w-md overflow-hidden"
        >
          {/* Weather Card */}
          <div className={`rounded-3xl shadow-2xl overflow-hidden ${theme === "dark" ? "text-black" : "text-white"}`}>
            {/* Top section with background based on weather */}
            <div className={`${getWeatherBackground()} p-6 relative`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold">{weather.name}</h2>
                  <p className="text-lg opacity-90">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-lg capitalize mt-1">{weather.weather[0].description}</p>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                  className="w-24 h-24 -mt-4 -mr-4"
                />
              </div>

              <div className="mt-4">
                <TemperatureDisplay temperature={weather.main.temp} />
                <div className="flex items-center mt-1 text-sm opacity-90">
                  <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
                  <span className="mx-2">•</span>
                  <span>Min: {Math.round(weather.main.temp_min)}°C</span>
                  <span className="mx-2">•</span>
                  <span>Max: {Math.round(weather.main.temp_max)}°C</span>
                </div>
              </div>
            </div>

            {/* Bottom section with additional info */}
            <div
              className={`p-5 grid grid-cols-2 gap-4 ${theme === "dark" ? "bg-gray-800" : "bg-white text-gray-800"}`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <img className="w-6 h-6" src={humidity || "/placeholder.svg"} alt="Humidity" />
                </div>
                <div>
                  <p className="text-sm opacity-70">Humidity</p>
                  <p className="font-semibold">{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <img className="w-6 h-6" src={wind || "/placeholder.svg"} alt="Wind" />
                </div>
                <div>
                  <p className="text-sm opacity-70">Wind Speed</p>
                  <p className="font-semibold">{weather.wind.speed} km/h</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-70">Pressure</p>
                  <p className="font-semibold">{weather.main.pressure} hPa</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-70">Visibility</p>
                  <p className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>
            </div>

            {/* Refresh button */}
            <div className={`p-4 flex justify-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <button
                onClick={() => fetchWeather()}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition-colors shadow-md flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {forecast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 w-full max-w-md"
        >
          <div
            className={`rounded-2xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
          >
            <div className={`p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
              <h3 className="text-xl font-bold">5-Day Forecast</h3>
            </div>
            <div className="p-4 grid grid-cols-5 gap-2">
              {forecast.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm font-medium">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                    className="mx-auto w-10 h-10"
                  />
                  <p className="text-sm font-bold">{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default WeatherApp