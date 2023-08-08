const apiKey = '710a1db617359dfe93788497ab2c25bc';


//uses api key to access weather data via city
async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        const data = await response.json();
        console.log('api response', data);
        return data;
    } catch (error) {
        console.error('Cant fetch data', error);
        return null;
    }
}
//displays weather data for current day
function displayCurrentWeather(weatherData) {
    const currentWeatherElement = document.getElementById('current-weather');
console.log(weatherData);

const cityName = weatherData.city.name;
const currentDate = new Date();
const weatherIcon = weatherData.list[0].weather[0].icon;
const temperature = (weatherData.list[0].main.temp - 273.15).toFixed(2);
const humidity = weatherData.list[0].main.humidity;
const windSpeed = weatherData.list[0].wind.speed;

const currentWeatherData = `
<h2>${cityName} - ${currentDate.toLocaleDateString()}</h2>
<img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt "Weather Photo">
<p>Temp: ${temperature} °C</p>
<p>Humidity: ${humidity} %</p>
<p>Wind: ${windSpeed} m/s</p>
`;

currentWeatherElement.innerHTML = currentWeatherData;
}
//displays 5day forecast
function displayForecast(weatherData) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = '';

    const noonForecast = weatherData.list.filter((forecast) => {
        const date = new Date(forecast.dt * 1000);
        return date.getUTCHours() === 12;
    });

    const fiveDayForecast = noonForecast.slice(0,5);

    fiveDayForecast.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const weatherIcon = forecast.weather[0].icon;
        const temperature = (forecast.main.temp - 273.15).toFixed(2);
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;
    

    const forecastHTML = `
        <div class="forecast-item">
        <p>Date: ${date.toLocaleDateString()}</p>
        <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity} %</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
        `;
        
        forecastElement.innerHTML += forecastHTML;
});
}
//adds searched city to history
function addToHistory(city) {
    let searchHistory = localStorage.getItem('searchHistory');

    if (!searchHistory) {
        searchHistory = [];
    } else {
        searchHistory = JSON.parse(searchHistory);
    }

    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city)
    }
    const searchHistoryMax = 5;

    if (searchHistory.length > searchHistoryMax) {
        searchHistory = searchHistory.slice(0, searchHistoryMax);
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    displaySearchHistory(searchHistory);
}
//displays search history of previously selected cities
function displaySearchHistory(searchHistory) {
    const searchHistoryElement = document.getElementById('search-history');
    searchHistoryElement.innerHTML = '';

    searchHistory.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        searchHistoryElement.appendChild(button);
    });
}
//adds event listener to search button
document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value;

    if (city !== '') {
        const weatherData = await getWeatherData(city);
        if (weatherData) {
            displayCurrentWeather(weatherData);
            displayForecast(weatherData);
            addToHistory(city);
            cityInput.value = '';
        }
    }
});
//adds event listener to search history, updates when new city is submitted
document.getElementById('search-history').addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
        const city = event.target.textContent;
        const weatherData = await getWeatherData(city);
        if (weatherData) {
            displayCurrentWeather(weatherData);
            displayForecast(weatherData);
        }
    }
});