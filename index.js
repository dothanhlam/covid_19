const https = require('https')
const express = require('express');
const app = express();
const path = require('path');

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
                resolve(JSON.parse(data));
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', function (req, res) {
    fetchCovidAllTheWorld().then(world => {
        fetchCovidDataByCountry().then(countries => {
            fetchCovidHistorical().then(historical => {
                fetchCovidHistorical('china').then(china => {
                    fetchCovidHistorical('canada').then(canada => {
                        fetchCovidHistorical('australia').then(australia => {
                            historical.push(china);
                            historical.push(canada);
                            historical.push(australia);
                            res.render('index', { world, countries, historical });
                        });
                    });
                });
            });
        });
    });
});
app.listen(8080);
console.log('8080 is the magic port');