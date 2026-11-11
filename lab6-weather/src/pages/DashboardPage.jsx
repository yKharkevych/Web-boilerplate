import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import WeatherCard from '../pages/WeatherCard.jsx'
import './DashboardPage.css'

const KYIV = {
    latitude: 50.45,
    longitude: 30.52
}

function DashboardPage() {
    const navigate = useNavigate()

    const [location, setLocation] = useState(KYIV)
    const [locationName, setLocationName] = useState('Kyiv')
    const [weather, setWeather] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [locationError, setLocationError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        async function fetchWeather() {
            setLoading(true)
            setError('')

            try {
                const params = new URLSearchParams({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    daily: [
                        'temperature_2m_max',
                        'temperature_2m_min',
                        'weather_code'
                    ].join(','),
                    timezone: 'auto',
                    forecast_days: '5'
                })

                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?${params}`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error('Could not load weather data')
                }

                const data = await response.json()

                if (!data.daily || !data.daily.time) {
                    throw new Error('Weather data is unavailable')
                }

                const forecast = data.daily.time.map((date, index) => ({
                    date,
                    maxTemp: data.daily.temperature_2m_max[index],
                    minTemp: data.daily.temperature_2m_min[index],
                    weatherCode: data.daily.weather_code[index]
                }))

                if (!controller.signal.aborted) {
                    setWeather(forecast)
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(err.message)
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchWeather()

        return () => controller.abort()
    }, [location])

    function useMyLocation() {
        setLocationError('')

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported')
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })

                setLocationName('Your location')
                setLocationError('')
            },
            () => {
                setLocationError(
                    'Could not get your location. Please allow location access.'
                )
            }
        )
    }

    function showKyivWeather() {
        setLocation(KYIV)
        setLocationName('Kyiv')
        setLocationError('')
    }

    function handleLogout() {
        document.cookie =
            'isLoggedIn=; path=/; max-age=0; SameSite=Lax'

        navigate('/login', { replace: true })
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>Weather Dashboard</h1>
                    <p>5-day weather forecast for {locationName}</p>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </header>

            <main className="dashboard-main">
                <div className="weather-controls">
                    <button onClick={showKyivWeather}>
                        Kyiv weather
                    </button>

                    <button onClick={useMyLocation}>
                        Use my location
                    </button>
                </div>

                {locationError && (
                    <p className="weather-error" role="alert">
                        {locationError}
                    </p>
                )}

                {loading ? (
                    <div className="weather-loading" role="status">
                        <div className="spinner"></div>
                        <p>Loading weather...</p>
                    </div>
                ) : error ? (
                    <p className="weather-error" role="alert">
                        {error}
                    </p>
                ) : (
                    <div className="weather-grid">
                        {weather.map((day) => (
                            <WeatherCard
                                key={day.date}
                                date={day.date}
                                maxTemp={day.maxTemp}
                                minTemp={day.minTemp}
                                weatherCode={day.weatherCode}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default DashboardPage
