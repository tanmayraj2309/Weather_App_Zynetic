# Weather App

## Overview
This is a React-based Weather App that fetches and displays real-time weather data. The app includes components for searching weather by location, displaying temperature in various units, and handling errors gracefully.

## Features
- Search weather by city name
- Display temperature in Celsius and Fahrenheit
- Fetch real-time weather data from an API
- Handle errors for incorrect city names

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/weather-app.git
   ```
2. Navigate to the project folder:
   ```sh
   cd weather-app
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm start
   ```

## File Structure
```
weather-app/
│-- src/
│   │-- components/
│   │   │-- SearchBar.jsx
│   │   │-- TemperatureDisplay.jsx
│   │   │-- WeatherCard.jsx
│   │   │-- NotFound.jsx
│   │-- App.js
│   │-- index.js
│-- public/
│-- package.json
│-- README.md
```

## Usage
- Enter a city name in the search bar and press enter.
- View the current temperature and weather details.
- Toggle temperature units between Celsius and Fahrenheit.

## Technologies Used
- React.js
- OpenWeather API (or any chosen weather API)
- CSS (or Tailwind CSS for styling)

## API Configuration
- Sign up on OpenWeather API and get an API key.
- Create a `.env` file in the root directory and add:
  ```sh
  REACT_APP_WEATHER_API_KEY=your_api_key_here
  ```

## Contribution
Feel free to fork the repository and submit pull requests for improvements!



