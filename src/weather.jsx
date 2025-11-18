function Weather({ data, unit = 'C' }) {
  const { name, main = {}, weather = [], wind = {}, sys = {} } = data || {};

  const formatTime = (unixSec) => {
    if (!unixSec) return '-';
    const date = new Date(unixSec * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const cToF = (c) => Math.round((c * 9) / 5 + 32);
  const formatTemp = (tempC) => {
    if (tempC == null) return '-';
    return unit === 'C' ? Math.round(tempC) + '°C' : cToF(tempC) + '°F';
  };

  const formatWind = (speedMs) => {
    if (speedMs == null) return '-';
    if (unit === 'C') return Math.round(speedMs * 10) / 10 + ' m/s';
    const mph = speedMs * 2.2369362920544;
    return Math.round(mph * 10) / 10 + ' mph';
  };

  const description = weather[0]?.description || '-';
  const icon = weather[0]?.icon;

  return (
    <div className="weather-box">
      <h2>{name}</h2>

      <p style={{ fontSize: '24px', margin: '10px 0' }}>
        {formatTemp(main.temp)}
      </p>

      <p style={{ textTransform: 'capitalize' }}>{description}</p>

      {icon && (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
        />
      )}

      <div style={{ marginTop: '0.6rem', textAlign: 'left', display: 'inline-block' }}>
        <div>Feels like: {formatTemp(main.feels_like)}</div>
        <div>Humidity: {main.humidity != null ? main.humidity + '%' : '-'}</div>
        <div>Wind: {formatWind(wind.speed)}</div>
        <div>Sunrise: {formatTime(sys.sunrise)}</div>
        <div>Sunset: {formatTime(sys.sunset)}</div>
      </div>
    </div>
  );
}

export default Weather;