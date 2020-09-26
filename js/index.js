"user strict";
window.onload = () => {
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

  let createDiv = document.createElement("div");
  app.insertAdjacentElement("beforeend", createDiv);

  let createTable = document.createElement("table");
  app.insertAdjacentElement("beforeend", createTable);

  const submitForm = (e) => {
    e.preventDefault();

    // to clear tables if to be submitting again
    createDiv.innerHTML = "";
    createTable.innerHTML = "";

    let getAddress = document.getElementById("address");

    const url =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(getAddress.value) +
      ".json?access_token=pk.eyJ1IjoiYWltZWVseW5ucmFtaXJlejMiLCJhIjoiY2s3MXpjdXhoMGF3YjNtbXl6em9nMWRtbCJ9.atrDeTFuHq0gGUwi5Kq1_w";

    class Geocode {
      constructor(url) {
        this.url = url;
      }
      loadData() {
        fetch(this.url).then((response) => {
          response.json().then((data) => {
            mapbox(data);
            //return data;
          });
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

    //mapbox api
    const mapbox = (data) => {
      let featuresLat = data.features[0].center[1];
      let featuresLong = data.features[0].center[0];
      //Retrieve Numerical data. Example: Longitude And Latitude, Address, Temperature.
      let locations = data.features[0].place_name;
      createDiv.innerHTML += `<h4 id='message'><strong> Coordinates: </strong><hr/> latitude: ${featuresLat}, longitude:${featuresLong} <hr/> Location: ${locations}</h4>`;
      let url =
        "https://api.weather.gov/points/" + featuresLat + "," + featuresLong;
      //get forecast once
      let getFetchForecast = new Geocode(url);

      getFetchForecast.loadForecast(url);
    };
    //national weather service api

    const forecast = (data) => {
      // console.log(data.url)
      fetch(data.url)
        .then((response) => response.json())
        .then((weather) => {
          //   console.log(weather);
          createDiv.innerHTML +=
            "<h4 id='message'> Relative Location: <hr/>" +
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
                let ended = new Date(
                  weatherDaily.properties.periods[i].endTime
                );
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
              fetch(
                "https://dry-earth-81823.herokuapp.com/weather?address=" +
                  location
              )
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                  // createDiv.setAttribute("id", "messageId");
                  // let getIdMessage = document.getElementById("messageId");
                  createDiv.innerHTML +=
                    "<div id='message' style='width:50%;'>" +
                    " <h3>Daily Forecast:</h3> <br/>" +
                    data.forecast +
                    "<h3>Location: </h3>" +
                    data.location +
                    "<h3/>Address: </h3>" +
                    data.address.toUpperCase();
                  +"</div>";
                });

              //  setTimeout(() => {
              //    // console.log(document.querySelector("notification"));
              //    createDiv.innerHTML = "";
              //  }, 5000);

              // let getTableFocus = document.querySelector("table");
              // getTableFocus.id = "tableFocus";
              // let getFocus = document.getElementById("tableFocus");
              //console.log(getFocus.scrollIntoView(true))
              // getFocus.scrollIntoView(true);
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
  document.addEventListener("click", submitForm);
};
