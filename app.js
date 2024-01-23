
const express = require('express');
const bodyParser = require('body-parser');
const Redis = require('ioredis');
const app = express();
const port = 4000;
const redis = new Redis.Cluster([
  { host: '127.0.0.1', port: 7001 },
  { host: '127.0.0.1', port: 7002 },
  { host: '127.0.0.1', port: 7003 },
]);
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Redis CRUD API');
});
app.post('/data', (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) {
        return res.status(400).send('Enter the data');
    }
    redis.set(key, value)
        .then(() => res.send('Successfully data has been added'))
        .catch((err) => res.status(500).send(`Error: ${err.message}`));
});
app.get('/data/:key', (req, res) => {
    const { key } = req.params;
    if (!key) {
        return res.status(400).send('Parameters are required.');
    }
    redis.get(key)
        .then((result) => {
            if (result === null) {
                res.status(404).send(`Key "${key}" key was not found in redis.`);
            } else {
                res.send(`Value for key "${key}": ${result}`);
            }
        })
        .catch((err) => res.status(500).send(`data receiving from redis is error: ${err.message}`));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});








