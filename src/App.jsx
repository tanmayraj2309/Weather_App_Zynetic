"use client"

import { useEffect, useContext, useState, useRef } from "react" // Add useRef
import axios from "axios"
import { motion } from "framer-motion"
import { ApiContext } from "./contexts/ApiContext"
import NotFound from "./components/NotFound"
import ForcastDetail from "./components/ForcastDetail"
import WeatherDetails from "./components/WeatherDetails"
import { div } from "framer-motion/client"

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

  const [headerColor, setHeaderColor] = useState("text-blue-800")
  const suggestionRef = useRef(null) // Add ref for suggestion box

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  
  useEffect(() => {
    const colors = ["text-blue-800", "text-green-600"];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setHeaderColor(colors[index]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setSuggestions([]) // Close suggestions when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setSuggestions])

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

  const getTimeOfDay = () => {
    if (!weather) return "day"
    const sunrise = weather.sys.sunrise * 1000
    const sunset = weather.sys.sunset * 1000
    const now = Date.now()
    return now > sunrise && now < sunset ? "day" : "night"
  }

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
    <div className={`flex flex-col items-center justify-center min-h-screen p-12 transition-all ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
    }`}>
      <div className="w-[800px] p-6 bg-white rounded-lg shadow-lg">
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
      <form className="flex gap-2 items-center w-full " onSubmit={fetchWeather}>
        <div className="relative w-full" ref={suggestionRef}> {/* Add ref to the container */}
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
      {weather && (
        <WeatherDetails getWeatherBackground={getWeatherBackground}/>
      )}
      {forecast && <ForcastDetail weather={weather} />}
    </div>
    </div>
  )
}

export default WeatherApp