# RamirezAimee_openAPI

Repository Link: https://github.com/alramirez1/RamirezAimee_openAPI.git

Live Demo: https://alramirez1.github.io/RamirezAimee_openAPI/


Name of API:
- MapBox 
- National Weather Service 

URL of API source:  
- https://docs.mapbox.com/help/tutorials/local-search-geocoding-api/ 
- https://weather-gov.github.io/api/gridpoints


## Mapping API


| Name of API       | URL of API source |  Data |
| ------------- |:-------------:| -------------------:|
| MapBox    |  `https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN`, | Numerial |



## Weather API

| Name of API       | URL of API source |  Data |
| ------------- |:-------------:| -------------------:|
| National Weather Service     |  `https://api.weather.gov/points/{lat},{lon}`,`https://api.weather.gov/gridpoints/BOX/{gridX},{gridY}/forecast` | String |
| National Weather Service      |  `https://api.weather.gov/gridpoints/BOX/{gridX},{gridY}/forecast`   |   Images |
| National Weather Service   | `https://api.weather.gov/gridpoints/BOX/{gridX},{gridY}/forecast`, `https://api.weather.gov/points/{lat},{lon}`|    Numerical |


Youtube Link:

Remote Link: 


### Extra Credit

- https://darksky.net/dev/docs
    - hosted on: https://dry-earth-81823.herokuapp.com

------ 

### DarkSky API

| Name of API       | URL of API source |  Data |
| ------------- |:-------------:| -------------------:|
| DarkSky    |  `https://api.darksky.net/forecast/<api_key>/{latitude},{longitude};`, | Numerial |


------ 

> Please disregard if so I created this for extra credit on the DarkSky API since it was hosted and built externally since  on private keys. It was only used for the message box on container on API fetching.