<img src="./repoAssets/banner.png" />

<br />

PlantRecog aims to become or lead to the goto "Free Plant Recognition" solution. Why? As of today, 30th August 2021, there aren't many online free services or apps available to solve this problem. The existing solutions are mostly paid and have high subscription amounts per year. I want to create a fairly basic but usable set of services (app + api + models) for people who want to develop tools that recognize plants.

The current version of the project is able to recognize 299 plants using their flowers. This flower recognition model and API developed under this project are available freely in the repository. They can be self hosted by anyone who wants to use these services for building their own apps. These are also used in the PlantRecog App that can be downloaded from `Github Releases` (soon will be available on Google Play Store).

This is work in progress :>

<br />

## App
The PlantRecog React Native app is still under development phase, therefore please check out the `pre-release` available in the `Github release` section [here](https://github.com/sarthakpranesh/PlantRecog/releases).

<br />

## Recognition Service
This is the documentation for the server API that is used in PlantRecog. This server can be hosted online to develop apps that require such a service.

| Request | Payload | Description |
| --- | --- | --- |
| `get "/"` | `{"message":"Server Up and Fine"}` | Index route to make sure server is running, Heroku puts the server to sleep so it'll be great to call this in start of your app to wake the server up |
| `get "/details"` | `{"message":"Success","payload":{"recognized":["Abutilon","Acacia",...,"Zenobia","Zinnia"]}}` | Get all the recognized classes for the latest model available on the server |
| `post "/predict" content-type="multipart/form-data" parameter="image"` | `{"messages":"Success","payload":{"predictions":[{"name":"MorningGlory","score":0.38581109046936035},{"name":"Acacia","score":0.14158271253108978},{"name":"MoonflowerVine","score":0.12431787699460983},{"name":"LilyoftheValley","score":0.06644751876592636},{"name":"FrangipaniFlower","score":0.062477629631757736}]}}` | Post plant image using `multipart/form-data`, parameter name should be `image` and the route will provide the top 5 prediction for the plant image |

### Other services used
Gyan API - https://github.com/sarthakpranesh/Gyan

<br />

## Issues
If you come across any issues or have feature requests please open them [here](https://github.com/sarthakpranesh/PlantRecog/issues)

<br />

<h3>Made with ♥</h3>
