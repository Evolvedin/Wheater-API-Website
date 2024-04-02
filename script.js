let map;

function initMap() {
    map = L.map('map').setView([0, 0], 2); // Initialize with a global view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

async function getWeather() {
    const cityName = document.getElementById('cityName').value;
    const apiKey = 'e6fbd418c4613c3ca0bcdc4293fbd140';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(cityName)}&client_id=-oKeEgsbRjmQzEyNQrSp0DJtlyP6e5fnadqHi5W2ZvY`;

    try {
        // Fetch weather data
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) throw new Error('Weather data not found.');
        const weatherData = await weatherResponse.json();

        // Fetch city image from Unsplash
        const unsplashResponse = await fetch(unsplashUrl);
        if (!unsplashResponse.ok) throw new Error('Image not found.');
        const unsplashData = await unsplashResponse.json();

        displayWeather(weatherData);
        displayImage(unsplashData.urls.regular);
        updateMap(weatherData.coord.lat, weatherData.coord.lon);
    } catch (error) {
        console.error(error);
        document.getElementById('weatherResult').innerText = 'Failed to retrieve data.';
    }
}

function displayWeather(data) {
    const { name, main, weather, wind, clouds, sys } = data;
    const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString();
    
    document.getElementById('weatherResult').innerHTML = `
        <h2>Weather in ${name}</h2>
        <p><strong>Temperature:</strong> ${main.temp}°C</p>
        <p><strong>Description:</strong> ${weather[0].description}</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Pressure:</strong> ${main.pressure} hPa</p>
        <p><strong>Wind Speed:</strong> ${(wind.speed * 3.6).toFixed(2)} km/h</p>
        <p><strong>Wind Direction:</strong> ${wind.deg}°</p>
        <p><strong>Cloudiness:</strong> ${clouds.all}%</p>
        <p><strong>Sunrise:</strong> ${sunriseTime}</p>
        <p><strong>Sunset:</strong> ${sunsetTime}</p>
    `;
}

function displayImage(imageUrl) {
    document.getElementById('cityImage').src = imageUrl;
}

function updateMap(lat, lon) {
    map.setView([lat, lon], 13); // Update map view
    const marker = L.marker([lat, lon]).addTo(map); // Add marker for the city
    marker.bindPopup(`Current location: ${lat.toFixed(2)}, ${lon.toFixed(2)}`).openPopup();
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
});
