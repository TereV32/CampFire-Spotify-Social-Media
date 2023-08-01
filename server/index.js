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

    app.use('/', spotifyRouter)
    // Catch-all route to serve the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}
console.log(process.env.NODE_ENV)

const uri = process.env.DB_URI

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// const corsOption = {
//     origin: '*',
//     credentials: true,
//     optionsSuccessStatus: 200
// }
const allowedOrigins = ['https://campfire-1f3fc409de5e.herokuapp.com/'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests from the specified origins or when the origin is not provided (e.g., for local testing).
      callback(null, true);
    } else {
      // Block requests from other origins.
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions))
app.use('/', spotifyRouter)

//DB Connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
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