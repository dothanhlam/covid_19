const https = require('https')
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const hostname = 'https://corona.lmao.ninja';

function fetchCovidHistorical(country) {
    return new Promise((resolve, reject) => {
        const endPoint = country ? `${hostname}/v2/historical/${country}` : `${hostname}/v2/historical`;
        https.get(endPoint, resp => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                const parsedData = JSON.stringify(data);
                resolve(data);
            });
        }).on("error", (err) => {
            console.log('fetching error: ', err);
            reject(err);
        })
    });
}

function fetchCovidAllTheWorld() {
    return new Promise((resolve, reject) => {
        const endPoint = `${hostname}/all`;
        https.get(endPoint, resp => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on("error", (err) => {
            console.log('fetching error: ', err);
            reject(err);
        })
    });
}

function fetchCovidDataByCountry(country, sort = 'cases') {
    return new Promise((resolve, reject) => {
        const endPoint = country ? `${hostname}/countries/${country}` : `${hostname}/countries/?sort=${sort}`;
        https.get(endPoint, resp => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on("error", (err) => {
            console.log('fetching error: ', err);
            reject(err);
        })
    });
}

function transform(countries = [], output='./data/timeline.json') {
    let worldTimeline = [];
    countries.forEach(country => {
        const correctionData = {
            country: country.country,
            province: country.province,
            timeline: {},
        }

        const { cases, deaths, recovered } = country.timeline;
        Object.keys(cases).forEach(key => {
            correctionData.timeline[key] = {
                'date': key,
                'cases': cases[key],
            };
        });
        Object.keys(deaths).forEach(key => {
            correctionData.timeline[key] = {
                ...correctionData.timeline[key],
                'deaths': deaths[key],
            };
        });
        Object.keys(recovered).forEach(key => {
            correctionData.timeline[key] = {
                ...correctionData.timeline[key],
                recovered: recovered[key],
            };
        });

        worldTimeline.push(correctionData);
    });

    fs.writeFileSync(output, JSON.stringify(worldTimeline));

}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', function (req, res) {
    fetchCovidAllTheWorld().then(world => {
        fetchCovidDataByCountry().then(countries => {
            fetchCovidHistorical().then(historical => {
                fetchCovidHistorical('china').then(china => {
                    fetchCovidHistorical('canada').then(canada => {
                        fetchCovidHistorical('australia').then(australia => {
                            let correctHistoricalData = JSON.parse(historical);
                            correctHistoricalData.push(JSON.parse(china));
                            correctHistoricalData.push(JSON.parse(canada));
                            correctHistoricalData.push(JSON.parse(australia));
                            transform(correctHistoricalData);
                            res.render('index', { world, countries, historical: correctHistoricalData });
                        });
                    });
                });
            });
        });
    });
});
app.listen(8080);
console.log('8080 is the magic port');