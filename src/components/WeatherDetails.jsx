import React, { useContext } from 'react'
import { motion } from "framer-motion"
import { ApiContext } from '../contexts/ApiContext'
import TemperatureDisplay from './TemperatureDisplay'
import humidity from "../assets/image.png"
import wind from "../assets/wind.jpg"


const WeatherDetails = ({getWeatherBackground}) => {

    const {
        weather,
        fetchWeather,

        theme,
      } = useContext(ApiContext)


  return (
    <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 w-full  overflow-hidden"
        >
          {/* Weather Card */}
          <div className={`rounded-3xl shadow-2xl overflow-hidden ${theme === "dark" ? "text-black" : "text-white"}`}>
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
                <TemperatureDisplay
                 temperature={weather.main.temp} />
                <div className="flex items-center mt-1 text-sm opacity-90">
                  <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
                  <span className="mx-2">•</span>
                  <span>Min: {Math.round(weather.main.temp_min)}°C</span>
                  <span className="mx-2">•</span>
                  <span>Max: {Math.round(weather.main.temp_max)}°C</span>
                </div>
              </div>
            </div>
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
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-70">Pressure</p>
                  <p className="font-semibold">{weather.main.pressure} hPa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-70">Visibility</p>
                  <p className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>
            </div>
            <div className={`p-4 flex justify-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <button
                onClick={() => fetchWeather()}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition-colors shadow-md flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </motion.div>
  )
}

export default WeatherDetails
