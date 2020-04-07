# COVID-19 TRACKING DASHBOARD

The very simple tracking dashboard on covid-19. All real data fetching from https://corona.lmao.ninja/

## Features
- Display the world statistic for active cases, deaths, recovered (depending on api)
- Display specific chart for Vietnam (my country)
- Display all the rest of world, default sorting by 'cases'

## Incoming features
- Search  / Filtering
- Sorting

## How to use
- Install all dependencies by command ```$ npm install```
- Launch application ```$ npm start```
- Open browser, enter ```localhost:8080```

## D3JS
- You need to generate data first by uncomment the transform function call. This will generate all the data to csv per country.
- Install http-server by ```$ npm i http-server -g```
- Stop the server, run ```$ http-server .```
- Refresh the page

If you want to contribute, please open the pull request