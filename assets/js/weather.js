var APIKey = "325f3ba35b474abcba3d8b91c091c747";

var searchForm = document.getElementById("search-form");
var input = document.getElementById("citySearch");
var fiveDay = document.getElementById("fiveDay");

function getUserInput(e) {
  e.preventDefault();

  var userInput = input.value;

  getCurrentWeather(userInput);
  getFiveDay(userInput);
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
      console.log(data);
      var event = new Date();
      var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      var formatted = event.toLocaleDateString(undefined, options);

      console.log(formatted);
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
      console.log(data);
      var arr = [
        data.list[4],
        data.list[12],
        data.list[20],
        data.list[28],
        data.list[36],
      ];
      console.log(arr);
      fiveDay.innerHTML = "5-Day Forecast:";
      arr.forEach((element) => {
        console.log(element.main.temp + " °F");
        console.log(element.wind.speed + " MPH");
        console.log(element.main.humidity + " %");
        console.log(element.weather[0].icon);

        var date = new Date(element.dt_txt).toLocaleDateString();
        console.log(date);
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

      // var event = new Date();
      // var options = {
      //   weekday: "long",
      //   year: "numeric",
      //   month: "long",
      //   day: "numeric",
      // };

      // var formatted = event.toLocaleDateString(undefined, options);

      // console.log(formatted);
      // Expected output (varies according to local timezone and default locale): Thursday, December 20, 2012
    });
}

searchForm.addEventListener("submit", getUserInput);
