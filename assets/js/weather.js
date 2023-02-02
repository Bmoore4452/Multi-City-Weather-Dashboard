var APIKey = "325f3ba35b474abcba3d8b91c091c747";
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var searchHistory = document.getElementById("searchHistory");
var searchForm = document.getElementById("search-form");
var input = document.getElementById("citySearch");
var fiveDay = document.getElementById("fiveDay");
var currentWeather = document.getElementById("currentWeather");

// receives the input from the city search form
function getUserInput(e) {
  e.preventDefault();

  var userInput = input.value;
  if (userInput) runWeather(userInput);
  if (input.value === "") return;
  createBtn();
  input.value = "";
}

// funcction that runs the fetch functions for the Current and the 5-Day forecast
function runWeather(city) {
  getCurrentWeather(city);
  getFiveDay(city);
}

// fetches the current weather API
function getCurrentWeather(city) {
  let queryUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIKey;

  fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var event = new Date();
      var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      currentWeather.innerHTML = "";

      console.log(data);
      var formatted = event.toLocaleDateString(undefined, options);
      var icon = data.weather[0].icon;
      var banner = document.createElement("div");

      // gets the icons for the corresponding weather condition
      var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      banner.setAttribute("id", "banner");

      // creates the elements for the current weather in the html
      banner.innerHTML = `
                          <div>${data.name}</div>
                          <div>${formatted}</div>
                          <img src="${iconUrl}" alt="">
                          <div>${"Temp: " + data.main.temp + " °F"}</div>
                          <div>${"Wind: " + data.wind.speed + " MPH"}</div>
                          <div>${"Humidity: " + data.main.humidity + " %"}</div>
      `;

      currentWeather.append(banner);
      saveCity(data.name);

      // Expected output (varies according to local timezone and default locale): Thursday, December 20, 2012
    });
}

// fetched the API for the 5-Day forecast
function getFiveDay(city) {
  let queryUrl =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    APIKey;

  fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    // selects the times of day for the 5-Day forecast data
    .then(function (data) {
      var arr = [
        data.list[4],
        data.list[12],
        data.list[20],
        data.list[28],
        data.list[36],
      ];

      fiveDay.innerHTML = "5-Day Forecast:";
      arr.forEach((element) => {
        // converts the dates from the data to prefered format
        var date = new Date(element.dt_txt).toLocaleDateString();

        var icon = element.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        var card = document.createElement("div");
        card.setAttribute("id", "card");

        // creates the elements in the hmtl for the 5-Day forecast
        card.innerHTML = `
                          <div>${date}</div>
                          <img src="${iconUrl}" alt="">
                          <div>${"Temp: " + element.main.temp + " °F"}</div>
                          <div>${"Wind: " + element.wind.speed + " MPH"}</div>
                          <div>${
                            "Humidity: " + element.main.humidity + " %"
                          }</div>
                          
        `;
        fiveDay.append(card);
      });
    });
}

// saves the cities into local storage and makes sure that duplicates will not be saved
function saveCity(city) {
  if (city === "") {
    return null;
  }
  if (cities.indexOf(city) !== -1) {
    return;
  }
  cities.push(city);
  localStorage.setItem("cities", JSON.stringify(cities));
}

// creates the buttons for the search history which can be used to recall previously searched cities
function createBtn() {
  cities.forEach((element) => {
    var btn = document.createElement("button");
    btn.setAttribute("id", "searchHistory");
    btn.textContent = element;
    searchHistory.append(btn);
    btn.addEventListener("click", function () {
      runWeather(element);
    });
  });
}

// event listener for submit button in city search form
searchForm.addEventListener("submit", getUserInput);
