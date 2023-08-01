const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const spotifyRouter = require('./routes/spotifyRouter')
const mongoose = require('mongoose')
const path = require('path');
require('dotenv/config');

const app = express()

if (process.env.NODE_ENV === 'production') {
    // Serve the static files from the React app
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Any other routes or middleware can go here

    // Catch-all route to serve the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

const uri = process.env.DB_URI

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOption = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOption))
app.use('/', spotifyRouter)

//DB Connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB Connected")
    })
    .catch((err) => {
        console.log(err)
    })

const port = process.env.PORT || 3001
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})