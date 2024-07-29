const apiKey = 'YOUR_API_KEY';
const weatherInfo = document.getElementById('weatherInfo');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const errorMsg = document.getElementById('errorMsg');

document.getElementById('locationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const location = document.getElementById('locationInput').value;
    if (location) {
        fetchWeatherData(location);
    }
});

document.getElementById('geoLocateBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(null, lat, lon);
        }, showError);
    } else {
        errorMsg.textContent = 'Geolocation is not supported by this browser.';
        errorMsg.classList.remove('hidden');
    }
});

function fetchWeatherData(location, lat, lon) {
    let url;
    if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                throw new Error('City not found');
            }
            displayWeather(data);
        })
        .catch(error => {
            errorMsg.textContent = error.message;
            errorMsg.classList.remove('hidden');
        });
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    weatherIcon.style.backgroundImage = `url('http://openweathermap.org/img/wn/${data.weather[0].icon}.png')`;
    weatherInfo.classList.remove('hidden');
    errorMsg.classList.add('hidden');
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMsg.textContent = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMsg.textContent = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            errorMsg.textContent = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            errorMsg.textContent = 'An unknown error occurred.';
            break;
    }
    errorMsg.classList.remove('hidden');
}
