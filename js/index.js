"user strict";
window.onload = () => {
  /**
   * Create form fields
   */
  let featuresLat = "";
  let featuresLong = "";
  let locations = "";
  let app = document.getElementById("app");
  //Page must contain at least one Heading (H1) element.
  app.innerHTML += `<h1><strong>Open API: Project + Portfolio Demo</strong></h1>`;

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
 * Retrieve text (string) based data.
Example: User Avatar, Map Imagery, Logos
Retrieve Numerical data.
Example: Longitude And Latitude, Address, Temperature.
 */

  let createDiv = document.createElement("div");
  app.insertAdjacentElement("beforeend", createDiv);

  let createTable = document.createElement("table");
  app.insertAdjacentElement("beforeend", createTable);
  let getSubmitButton = document.querySelector("button");

  const submitForm = (e) => {
    e.preventDefault();
    // to clear tables if to be submitting again
    createDiv.innerHTML = "";
    createTable.innerHTML = "";

    let getAddress = document.getElementById("address");

    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(getAddress.value) +
      ".json?access_token=pk.eyJ1IjoiYWltZWVseW5ucmFtaXJlejMiLCJhIjoiY2s3MXpjdXhoMGF3YjNtbXl6em9nMWRtbCJ9.atrDeTFuHq0gGUwi5Kq1_w";

    class Geocode {
      constructor(url) {
        this.url = url;
      }
      loadData() {
        fetch(this.url).then((response) => {
          response
            .json()
            .then((data) => {
              mapbox(data);
            })
            .catch(function () {
              console.log("error");
              getAddress.value = "";
              getAddress.placeholder =
                "Sorry that location is not found, please try again.";
            });
        });
      }
      loadForecast() {
        fetch(this.url).then((data2) => {
          forecast(data2);
        });
      }
    }
    let getFetch = new Geocode(url);
    getFetch.loadData();

    //mapbox api
    const mapbox = (data) => {
      featuresLat = data.features[0].center[1];
      featuresLong = data.features[0].center[0];
      //Retrieve Numerical data. Example: Longitude And Latitude, Address, Temperature.
      locations = data.features[0].place_name;
      createDiv.innerHTML +=
        `<div id='message'><h3> Coordinates: </h3 > latitude: ${featuresLat} <br/> longitude:${featuresLong} <h3 >Location:</h3 > ${locations} </div>`;
      let url = "https://api.weather.gov/points/" + featuresLat + "," + featuresLong;
      //get forecast once
      let getFetchForecast = new Geocode(url);
      getFetchForecast.loadForecast(url);
    };

    //national weather service api
    const forecast = (data) => {
 
      fetch(data.url)
        .then((response) => response.json())
        .then((weather) => {
          createDiv.innerHTML +=
            "<div id='message'><h3 > Relative Location:</h3 >" +
            weather.properties.relativeLocation.properties.city + ", " +
            weather.properties.relativeLocation.properties.state +
            `<img src= "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${featuresLong},${featuresLat},14/400x300?access_token=pk.eyJ1IjoiYWltZWVseW5ucmFtaXJlejMiLCJhIjoiY2s3MXpjdXhoMGF3YjNtbXl6em9nMWRtbCJ9.atrDeTFuHq0gGUwi5Kq1_w" alt=" Map of ${locations}"></img>`+
            "</div>";

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

                let start = new Date(weatherDaily.properties.periods[i].startTime);
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

              //darksky api
              const location = getAddress.value;
              fetch("https://dry-earth-81823.herokuapp.com/weather?address=" + location)
                .then((response) => response.json())
                .then((data) => {
                  createDiv.innerHTML +=
                    "<div id='message' style='width:50%;'>" +
                    " <h3>Daily Forecast:</h3> <br/>" +
                    data.forecast +
                    "<h3>Location: </h3>" +
                    data.location +
                    "<h3/>Input: </h3>" +
                    data.address.toUpperCase();
                  +"</div>";
                });
            });
        })
        .catch(function () {
          console.log("error");
          getAddress.value = "";
          getAddress.placeholder ="Sorry that location is not found, please try again.";
        });
    };
  };
  let inputClear = document.querySelector("input");
  let clickInput = () => {
    inputClear.value = "";
    inputClear.placeholder = "";
  };
  inputClear.addEventListener("click", clickInput);

  getSubmitButton.addEventListener("click", submitForm);
};
