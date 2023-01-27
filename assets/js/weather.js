var APIKey = "325f3ba35b474abcba3d8b91c091c747";
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var searchHistory = document.getElementById("searchHistory");
var searchForm = document.getElementById("search-form");
var input = document.getElementById("citySearch");
var fiveDay = document.getElementById("fiveDay");
var currentWeather = document.getElementById("currentWeather");

function getUserInput(e) {
  e.preventDefault();

  var userInput = input.value;
  runWeather(userInput);
  createBtn();
  input.value = "";
}

function runWeather(city) {
  getCurrentWeather(city);
  getFiveDay(city);
}

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

      var formatted = event.toLocaleDateString(undefined, options);
      var icon = data.weather[0].icon;
      var banner = document.createElement("div");
      var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      banner.setAttribute("id", "banner");
      banner.innerHTML = `
                          <div>${formatted}</div>
                          <img src="${iconUrl}" alt="">
                          <div>${data.main.temp + " °F"}</div>
                          <div>${data.wind.speed + " MPH"}</div>
                          <div>${data.main.humidity + " %"}</div>
      `;

      currentWeather.append(banner);
      saveCity(data.name);

      // Expected output (varies according to local timezone and default locale): Thursday, December 20, 2012
    });
}

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
        var date = new Date(element.dt_txt).toLocaleDateString();

        var icon = element.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        var card = document.createElement("div");
        card.setAttribute("id", "card");

        card.innerHTML = `
                          <div>${date}</div>
                          <img src="${iconUrl}" alt="">
                          <div>${element.main.temp + " °F"}</div>
                          <div>${element.wind.speed + " MPH"}</div>
                          <div>${element.main.humidity + " %"}</div>
                          
        `;
        fiveDay.append(card);
      });
    });
}

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

function createBtn() {
  cities.forEach((element) => {
    var btn = document.createElement("button");
    btn.setAttribute("id", "searchHistory");
    btn.textContent = element;
    searchHistory.append(btn);
  });
}

searchForm.addEventListener("submit", getUserInput);
searchHistory.addEventListener("click", runWeather);
