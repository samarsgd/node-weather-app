const http = require('http');
const fs = require('fs');
const requests = require('requests'); // Assuming you have the 'requests' module installed

const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('%tempval%', orgVal.main.temp);
    temperature = temperature.replace('%tempmin%', orgVal.main.temp_min);
    temperature = temperature.replace('%tempmax%', orgVal.main.temp_max);
    temperature = temperature.replace('%location%', orgVal.name);
    temperature = temperature.replace('%country%', orgVal.sys.country);
    temperature = temperature.replace('%tempstatus%', orgVal.weather[0].main);
  
        return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Dehradun&units=metric&appid=ec3d1514fb8120e9cd98c89b9fbe5103')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join('');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(realTimeData);
        
                res.end();
            })
            .on('end', (err) => {
                if (err) {
                    console.error('Connection closed due to errors:', err);
                }
                res.end();
                console.log('Server response sent');
            });
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Not found');
        res.end();

    }
});

server.listen(4000,'127.0.0.1')


