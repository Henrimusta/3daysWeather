******************* APP USE *******************

This app lets user pinpoint location on map to get coordinates. Program then creates reverse geocoding api call to get location name.
Then location and coordinates are automatically saved to Google Firebase NoSQL database.
When Saved locations button is clicked, user can view all saved locations.
By clickig a saved location program creates apicall for 5day / 3hr weather forecast for that location.

******************* SETUP *******************

1st. run "npm i" to install necessary packages.
2nd. create Config.js and add provided code to file.
3rd. create .env and add provided code to file.
