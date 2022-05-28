const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api', (req, res) => {
    res.send('Hi Lorena');
});

app.listen('3333', () => {
    console.log('HTTP Server running on port 3333');
})