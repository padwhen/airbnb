const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors({
    credentials: true,
    origin: "http://localhost:3001/",
}))

app.get('/test', (request, response) => {
    response.json('Test ok')
});

app.listen(4000);