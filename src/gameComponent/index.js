import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import './index.css';

const cities = [
  { name: "New York" },
  { name: "Los Angeles" },
  { name: "Chicago" },
  { name: "Houston" },
  { name: "Phoenix" },
  { name: "Philadelphia" },
  { name: "San Antonio" },
  { name: "San Diego" },
  { name: "Dallas" },
  { name: "San Jose" }
];

const Game = () => {
  const [currentCityIndex, setCurrentCityIndex] = useState(Math.floor(Math.random() * cities.length));
  const [userGuess, setUserGuess] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [correctMessages, setCorrectMessages] = useState([]);
  const [wrongMessages, setWrongMessages] = useState([]);
  const [weather, setWeather] = useState(null);
  const city = cities[currentCityIndex].name;
  const API_KEY = 'e5b3f49657b2ccff409c34647081d13b'; 
  
  const correctAudio = useRef(new Audio('/audio/correct.mp3'));
  const wrongAudio = useRef(new Audio('/audio/wrong.mp3'));

  const fetchWeather = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      setWeather(data.main.temp);
    } catch (error) {
      console.error(error.message);
      setWrongMessages(prev => [...prev, "Error fetching weather data."]);
    }
  };

  const handleGuess = async () => {
    await fetchWeather(); 
    const userTemperature = parseInt(userGuess);

    if (weather !== null) {
      const correctMessage = "Correct!";
      const wrongMessage = `Wrong! The correct temperature in ${city} is ${Math.floor(weather)}°C.`;

      if (userTemperature === Math.floor(weather)) {
        setCorrectMessages(prev => {
          const newMessages = [...prev, correctMessage];
          return newMessages.length > 5 ? newMessages.slice(1) : newMessages; // Limit to 5 messages
        });
        setCorrectCount(prev => prev + 1);
        correctAudio.current.load();
      } else {
        setWrongMessages(prev => {
          const newMessages = [...prev, wrongMessage];
          return newMessages.length > 5 ? newMessages.slice(1) : newMessages; // Limit to 5 messages
        });
        setWrongCount(prev => prev + 1);
        wrongAudio.current.load();
      }

      if (currentCityIndex < cities.length - 1) {
        setCurrentCityIndex(currentCityIndex + 1);
      } else {
        setCorrectMessages(prev => [...prev, "Game Over! Refresh to play again."]);
      }
      setUserGuess('');
    }
  };

  return (
    <div className="App">
      <h1>City Temperature Guessing Game</h1>
      <div className="game-container">
        <h2>Guess the Temperature</h2>
        <p>What is the temperature in {city}?</p>
        <input
          type="number"
          required
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Enter temperature"
        />
        <Button type='primary' onClick={handleGuess}>Submit Guess</Button>

        {correctMessages.map((message, index) => (
          <div key={`correct-${index}`} className="result" style={{ backgroundColor: 'green', color: 'white' }}>
            {message}
          </div>
        ))}

        {wrongMessages.map((message, index) => (
          <div key={`wrong-${index}`} className="result" style={{ backgroundColor: 'red', color: 'white' }}>
            {message}
          </div>
        ))}

        {correctCount === 4 && (
          <div className="congratulations" style={{ backgroundColor: 'gold', color: 'black' }}>
            Congratulations! 
          </div>
        )}

        {wrongCount === 2 && (
          <div className="game-over" style={{ backgroundColor: 'darkred', color: 'white' }}>
            Game Over! Refresh to play again.
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
