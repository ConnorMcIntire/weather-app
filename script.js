const apiKey = 'Insert Here';

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('searchBtn');
    searchButton.addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            getWeather(city);
            getForecast(city);
        } else {
            document.getElementById('location').textContent = "Please enter a valid city.";
        }
    });
});

function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                document.getElementById('location').textContent = "City not found. Please try again.";
                document.getElementById('temperature').textContent = "--°F";
                document.getElementById('description').textContent = "--";
                document.getElementById('forecast').textContent = "";
            } else {
                document.getElementById('location').textContent = data.name;
                const tempF = Math.round(celsiusToFahrenheit(data.main.temp));
                document.getElementById('temperature').textContent = `${tempF}°F`;
                document.getElementById('description').textContent = data.weather[0].description;
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById('temperature').textContent = "Error loading weather";
        });
}

function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                document.getElementById('forecast').textContent = "No forecast available.";
            } else {
                let forecastHTML = "";
                for (let i = 0; i < 5; i++) {  // Show 5-day forecast
                    let item = data.list[i * 8]; // Every 8 entries = next day
                    let date = new Date(item.dt_txt).toDateString();
                    const tempF = Math.round(celsiusToFahrenheit(item.main.temp));
                    forecastHTML += `<p class="text-lg">${date}: ${tempF}°F</p>`;
                }
                document.getElementById('forecast').innerHTML = forecastHTML;
            }
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
            document.getElementById('forecast').textContent = "Error loading forecast";
        });
}