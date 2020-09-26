"user strict";
// const include = (file) => {
//   let script = document.createElement("script");
//   script.src = file;
//   //script.crossorigin = "anonymous";
//   script.defer = true;

//   getScript(script);
// };
// const getScript = (script) => {
//   let htmlScript = document.querySelector("body");
//   htmlScript.insertAdjacentElement("beforeend", script);
// };
// //because i really liked the icons
// include("https://kit.fontawesome.com/68ebcc4019.js");

/**
 * Create form fields
 */
let app = document.getElementById("app");
//Page must contain at least one Heading (H1) element.
app.innerHTML += `<h1> <strong>Open API: Project + Portfolio Demo</strong></h1>`;

let createForm = document.createElement("form");
let createInput = document.createElement("input");
createInput.id = "address";
createForm.innerHTML += `<div> <h3>Weather API </h3><br/> Search a location</div>`;
let createButtonSubmit = document.createElement("button");
app.insertAdjacentElement("beforeend", createForm);
createForm.insertAdjacentElement("beforeend", createInput);
createForm.insertAdjacentElement("beforeend", createButtonSubmit);
createButtonSubmit.type = "submit";
createButtonSubmit.innerHTML += `Submit`;

/**
 * Create table and get information
 * from https://weather-gov.github.io/api/gridpoints
 * api.weather.gov
 * Retrieve text (string) based data.

Example: User Avatar, Map Imagery, Logos
Retrieve Numerical data.
Example: Longitude And Latitude, Address, Temperature.

 */
let createDivLatLong = document.createElement("div");
createDivLatLong.id = "latLong";
app.insertAdjacentElement("beforeend", createDivLatLong);
let createDivLoc = document.createElement("div");
app.insertAdjacentElement("beforeend", createDivLoc);
let createDiv = document.createElement("div");
app.insertAdjacentElement("beforeend", createDiv);
let createTable = document.createElement("table");
app.insertAdjacentElement("beforeend", createTable);

const submitForm = (e) => {
  e.preventDefault();
  // to clear tables if to be submitting again
  createDivLatLong.innerHTML = "";
  createDivLoc.innerHTML = "";
  createDiv.innerHTML = "";
  createTable.innerHTML = "";

  let getAddress = document.getElementById("address");
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(getAddress.value) +
    ".json?access_token=pk.eyJ1IjoiYWltZWVseW5ucmFtaXJlejMiLCJhIjoiY2s3MXpjdXhoMGF3YjNtbXl6em9nMWRtbCJ9.atrDeTFuHq0gGUwi5Kq1_w";
  let featuresLat = "";
  let featuresLong = "";
  class Geocode {
    constructor(url) {
      this.url = url;
    }
    loadData() {
      fetch(this.url)
        .then((response) => response.json())
        .then((data) => {
          mapbox(data);
          //return data;
        });
    }
    loadForecast() {
      fetch(this.url).then((data2) => {
        forecast(data2);
        //return data;
      });
    }
  }
  let getFetch = new Geocode(url);
  getFetch.loadData();

  const mapbox = (data) => {
    featuresLat = data.features[0].center[1];
    featuresLong = data.features[0].center[0];
    //Retrieve Numerical data. Example: Longitude And Latitude, Address, Temperature.
    let locations = data.features[0].place_name;
    createDivLatLong.innerHTML = `<p><strong>GeoLocation: </strong><br/> latitude: ${featuresLat}, longitude:${featuresLong}</p>`;
    createDivLoc.innerHTML = `<p> Location: ${locations} </p>`;
    let url =
      "https://api.weather.gov/points/" + featuresLat + "," + featuresLong;
    //get forecast once
    let getFetchForecast = new Geocode(url);

    getFetchForecast.loadForecast(url);
  };

  const forecast = (data) => {
    // console.log(data.url)
    fetch(data.url)
      .then((response) => response.json())
      .then((weather) => {
        //   console.log(weather);
        createDiv.innerHTML =
          "<h4> Relative Location: " +
          weather.properties.relativeLocation.properties.city +
          ", " +
          weather.properties.relativeLocation.properties.state +
          "</h4>";

        let forecastUrl = weather.properties.forecast;

        fetch(forecastUrl)
          .then((response) => response.json())
          .then((weatherDaily) => {
            createTable.innerHTML += `
                        <thead>
                          <tr>
                            <th>Image</th>
  
                            <th >#</th>
                            <th >Day</th>
                            <th> Short Forecast</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th >Temperature</th>
                            <th >Detailed Forecast</th>

                          </tr>
                        </thead>
                      `;
            for (let i = 0; i < weatherDaily.properties.periods.length; i++) {
              let createTr = document.createElement("tr");
              createTable.insertAdjacentElement("beforeend", createTr);

              let start = new Date(
                weatherDaily.properties.periods[i].startTime
              );
              let ended = new Date(weatherDaily.properties.periods[i].endTime);
              createTr.innerHTML +=
                //Retrieve Images.
                "<img src='" +
                weatherDaily.properties.periods[i].icon +
                "'style='width:100px;'>" +
                "<td>" +
                weatherDaily.properties.periods[i].number +
                " </td> " +
                "<td>" +
                weatherDaily.properties.periods[i].name +
                " </td> " +
                "<td>" +
                weatherDaily.properties.periods[i].shortForecast +
                "</td>" +
                "<td>" +
                start +
                " </td><td>" +
                ended +
                " </td><td>" +
                weatherDaily.properties.periods[i].temperature +
                " " +
                weatherDaily.properties.periods[i].temperatureUnit +
                "°" +
                "</td>" +
                "<td>" +
                weatherDaily.properties.periods[i].detailedForecast +
                "</td>";
            }

            let getTableFocus = document.querySelector("table");
            getTableFocus.id = "tableFocus";
            let getFocus = document.getElementById("tableFocus");
            //console.log(getFocus.scrollIntoView(true))
            getFocus.scrollIntoView(true);
          });
      })
      .catch(function () {
        console.log("error");
        getAddress.value = "";
        getAddress.placeholder =
          "Sorry that location is not found, please try again.";
      });
  };
};
createButtonSubmit.addEventListener("click", submitForm);
