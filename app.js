const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

//app data
const weather = {}

weather.temperature = {
    unit: "celsius"
}

//app consts and vars
const KELVIN = 273;
//Api Key
const key = "a9647151cde944beb495b98a53dfba89";

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setposition, showError);
}
else{
    notificationElement.style.display = "block"
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

//set user's position
function setposition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude,longitude);
}

//show error when therer is an issue with geolocation service
function showError(error){
    notificationElement.style.display = "block"
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//get weather for api provider
function getWeather(latitude,longitude){
    let API = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(API)
        .then(function(response){
            let data = response.json();
            return data
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}
 
//display weather to ui
function displayWeather(){
    iconElement.innerHTML = `<img src="icon/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature *9/5) + 32;
}

//when the user clickes on the temp element
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celcius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celcius";
    }
})