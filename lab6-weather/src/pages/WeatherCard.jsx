const weatherDescriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Snow',
    75: 'Heavy snow',
    80: 'Rain showers',
    81: 'Rain showers',
    82: 'Heavy rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with hail',
}

function getWeatherIcon(code) {
    if (code === 0) return '☀️'
    if (code <= 2) return '🌤️'
    if (code === 3) return '☁️'
    if (code === 45 || code === 48) return '🌫️'
    if (code >= 51 && code <= 55) return '🌦️'
    if (code >= 61 && code <= 65) return '🌧️'
    if (code >= 71 && code <= 75) return '❄️'
    if (code >= 80 && code <= 82) return '🌧️'
    if (code >= 95) return '⛈️'

    return '🌡️'
}

function WeatherCard({ date, maxTemp, minTemp, weatherCode }) {
    const formattedDate = new Date(
        `${date}T12:00:00`
    ).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    })

    return (
        <article className="weather-card">
            <h3>{formattedDate}</h3>

            <div className="weather-icon">
                {getWeatherIcon(weatherCode)}
            </div>

            <p className="weather-description">
                {weatherDescriptions[weatherCode] ?? 'Unknown'}
            </p>

            <p className="weather-temperature">
                {Math.round(maxTemp)}°C
            </p>

            <p className="weather-min-temperature">
                Min: {Math.round(minTemp)}°C
            </p>
        </article>
    )
}

export default WeatherCard