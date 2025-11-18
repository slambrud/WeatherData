import { useState, useEffect } from 'react';
import Weather from './weather';
import Forecast from './Forecast';
import Favorites from './Favorites';

function App() {
  const [city, setCity] = useState(() => localStorage.getItem('weather_last_city') || '');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem('weather_unit') || 'C');
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('weather_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const fetchWeather = async () => {
  setLoading(true);
  setError('');
  // clear previous results while we fetch
  setWeatherData(null);
  setForecastData(null);

  // Read API key from Vite env: VITE_OPENWEATHER_KEY
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  if (!city || !city.trim()) {
    setError('Please enter a city name');
    setLoading(false);
    setForecastData(null);
    return;
  }

  if (!apiKey) {
    setError('Missing API key. Set VITE_OPENWEATHER_KEY in your .env');
    setLoading(false);
    setForecastData(null);
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    if (data.cod === 200) {
      setWeatherData(data);
      try {
        // persist last successful city name
        localStorage.setItem('weather_last_city', data.name);
      } catch (e) {
        // ignore storage errors
      }
      fetchForecast(data.name);
    } else {
      // OpenWeather returns message and cod when city not found, etc.
      setError(data.message || 'City not found');
      setWeatherData(null);
      setForecastData(null);
    }
  } catch (err) {
    setError('Something went wrong while fetching weather');
    setForecastData(null);
  }
  setLoading(false);
};
const fetchForecast = async (cityName) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
  if (!apiKey) {
    // same error handling you already use
    return;
  }
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`
    );
    const json = await res.json();
    if (json.cod === '200' || res.ok) {
      // store both list and city (which contains timezone offset)
      setForecastData({ list: json.list || [], city: json.city || null });
    } else {
      // forecast-specific fallback (don't overwrite main error)
      console.warn('Forecast API:', json);
      setForecastData(null);
    }
  } catch (e) {
    console.warn('Forecast fetch error', e);
    setForecastData(null);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    // delegate to the same fetch function
    fetchWeather();
  };

  // persist unit when changed and optionally restore on load
  const handleSetUnit = (u) => {
    setUnit(u);
    try {
      localStorage.setItem('weather_unit', u);
    } catch (e) {
      // ignore storage errors (e.g., private mode)
    }
  };

  // on mount, if there's a saved city try to auto-fetch its weather
  useEffect(() => {
    if (city && city.trim()) {
      // fetchWeather will read `city` from state
      fetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep favorites persisted
  useEffect(() => {
    try {
      localStorage.setItem('weather_favorites', JSON.stringify(favorites));
    } catch (e) {
      // ignore
    }
  }, [favorites]);

  const addFavorite = (name) => {
    if (!name) return;
    setFavorites((cur) => {
      const normalized = cur.map((s) => s.toLowerCase());
      if (normalized.includes(name.toLowerCase())) return cur;
      return [...cur, name];
    });
  };

  const removeFavorite = (name) => {
    setFavorites((cur) => cur.filter((s) => s.toLowerCase() !== name.toLowerCase()));
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block' }}>
        <label htmlFor="city-input" style={{ display: 'none' }}>City</label>
        <input
          id="city-input"
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="City name"
        />
        <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? 'Searching...' : 'Get Weather'}
        </button>
      </form>

      <div style={{ display: 'inline-block', marginLeft: 12 }} aria-hidden>
        <button
          type="button"
          onClick={() => handleSetUnit('C')}
          disabled={unit === 'C'}
          style={{ marginRight: 6 }}
        >
          °C
        </button>
        <button
          type="button"
          onClick={() => handleSetUnit('F')}
          disabled={unit === 'F'}
        >
          °F
        </button>
      </div>
      {loading && (
        <div className="loading-row">
          <div className="spinner" aria-hidden="true" />
          <span style={{ marginLeft: 8 }}>Loading...</span>
        </div>
      )}

      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}
{weatherData && <Weather data={weatherData} unit={unit} />}
      {weatherData && (
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            onClick={() => addFavorite(weatherData.name)}
            disabled={favorites.some((f) => f.toLowerCase() === weatherData.name.toLowerCase())}
          >
            Save to favorites
          </button>
        </div>
      )}

      {favorites.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4>Favorites</h4>
          <Favorites
            favorites={favorites}
            onSelect={(name) => {
              setCity(name);
              // fetch immediately for quick selection
              fetchWeather();
            }}
            onRemove={(name) => removeFavorite(name)}
          />
        </div>
      )}
      {forecastData?.list && (
        <div>
          <h3 style={{ marginTop: 16 }}>5-Day Forecast</h3>
          <Forecast list={forecastData.list} unit={unit} timezone={forecastData.city?.timezone} />
        </div>
      )}
    </div>
  );
}

export default App;