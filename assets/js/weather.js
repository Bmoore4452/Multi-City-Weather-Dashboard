console.log("All set up");

const APIKey = "325f3ba35b474abcba3d8b91c091c747";
let city = "atlanta"
let queryUrl =
  "http://api.openweathermap.org/data/2.5/forecast?q=" +
  city +
  "&appid=" +
  APIKey;

fetch(queryUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data.city.coord);
  });
