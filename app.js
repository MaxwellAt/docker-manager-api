const express = require('express');
const dockerManager = require('./dockerManager');

const app = express();
const PORT = 8000;

app.use(express.json());

app.post('/', async (req, res) => {
    console.log('REQUES REALIZED')
    const {composeInfo} = req.body;
    const result = await dockerManager.up(composeInfo);

    console.log('REQUEST FINISHED')
    res.json({result});
})

app.post('/down', (req, res) => {
    const {composeInfo} = req.body;
    dockerManager.down(composeInfo);

    res.json({});
})

app.listen(PORT, () => {
    console.log(`Listening on PORT (${PORT})`);
})