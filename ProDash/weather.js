// Weather Module
const WeatherApp = (() => {
    const weatherCity = document.getElementById('weatherCity');
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const forecastDisplay = document.getElementById('forecastDisplay');

    // Using Open-Meteo API (free, no key required)
    const getWeather = async (city) => {
        try {
            // Geocoding API
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
            );
            const geoData = await geoResponse.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                weatherDisplay.innerHTML = '<p>City not found</p>';
                return;
            }

            const { latitude, longitude, name, country } = geoData.results[0];

            // Weather API
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            const weatherData = await weatherResponse.json();
            
            displayWeather(weatherData, name, country);
            displayForecast(weatherData);
        } catch (error) {
            weatherDisplay.innerHTML = '<p>Error fetching weather data</p>';
            console.error(error);
        }
    };

    const getWeatherDescription = (code) => {
        const descriptions = {
            0: '☀️ Clear sky',
            1: '🌤️ Mainly clear',
            2: '⛅ Partly cloudy',
            3: '☁️ Overcast',
            45: '🌫️ Foggy',
            48: '🌫️ Foggy',
            51: '🌧️ Light drizzle',
            53: '🌧️ Moderate drizzle',
            55: '🌧️ Dense drizzle',
            61: '🌧️ Slight rain',
            63: '🌧️ Moderate rain',
            65: '🌧️ Heavy rain',
            80: '🌧️ Slight showers',
            81: '🌧️ Moderate showers',
            82: '🌧️ Violent showers',
            85: '❄️ Slight snow showers',
            86: '❄️ Heavy snow showers',
            95: '⛈️ Thunderstorm'
        };
        return descriptions[code] || '🌡️ Unknown';
    };

    const displayWeather = (data, cityName, country) => {
        const current = data.current;
        const temp = Math.round(current.temperature_2m);
        const humidity = current.relative_humidity_2m;
        const windSpeed = Math.round(current.wind_speed_10m);
        const description = getWeatherDescription(current.weather_code);

        weatherDisplay.innerHTML = `
            <div class="weather-main">${temp}°C</div>
            <div class="weather-desc">${description}</div>
            <div style="font-size: 1.1rem; margin-bottom: 1rem;">${cityName}, ${country}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-label">Humidity</div>
                    <div class="weather-value">${humidity}%</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-label">Wind Speed</div>
                    <div class="weather-value">${windSpeed} km/h</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-label">Feels Like</div>
                    <div class="weather-value">${temp}°C</div>
                </div>
            </div>
        `;
    };

    const displayForecast = (data) => {
        const daily = data.daily;
        const forecast = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < 5; i++) {
            const date = new Date(daily.time[i]);
            const dayName = days[date.getDay()];
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const description = getWeatherDescription(daily.weather_code[i]);

            forecast.push(`
                <div class="forecast-item">
                    <div class="forecast-day">${dayName}</div>
                    <div>${description}</div>
                    <div style="margin-top: 0.5rem; font-weight: bold;">
                        ${maxTemp}° / ${minTemp}°
                    </div>
                </div>
            `);
        }

        forecastDisplay.innerHTML = forecast.join('');
    };

    const setupEventListeners = () => {
        getWeatherBtn.addEventListener('click', () => {
            if (weatherCity.value.trim()) {
                getWeather(weatherCity.value);
            }
        });

        weatherCity.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && weatherCity.value.trim()) {
                getWeather(weatherCity.value);
            }
        });

        // Load weather for default location
        getWeather('New York');
    };

    return {
        init: () => {
            setupEventListeners();
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    WeatherApp.init();
});
