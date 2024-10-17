import React, { useState } from 'react';
import axios from 'axios';
import './index.css'

const Main = ()=>{
    const [city, setCity] = useState('');
    const [number, setNumber] = useState('');
    const [weather, setWeather] = useState(null);
    const [message, setMessage] = useState('');
  
    const API_KEY = 'e5b3f49657b2ccff409c34647081d13b'; // Replace with your OpenWeatherMap API key
  
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        setWeather(response.data.main.temp);
      } catch (error) {
        console.error(error);
        setMessage('City not found or API error');
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      fetchWeather();
    };
  
    const compareWeather = () => {
      if (weather !== null) {
        const userNumber = parseFloat(number);
        if (userNumber === weather) {
       
          setMessage('Correct! The weather matches your number.');
        } else {
          setMessage(`Wrong! The current temperature in ${city} is ${weather}°C.`);
        }
      }
    };
  
    return (
      <div>
        <h1>Weather Game</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter a number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <button type="submit">Get Weather</button>
        </form>
        {weather && <button onClick={compareWeather}>Compare Weather</button>}
        <p>{message}</p>
      </div>
    );
  };

export default Main;