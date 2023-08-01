const express = require('express')
const router = express.Router()
const axios = require('axios');
const schemas = require('../routes/schemaModels')
const { MongoClient } = require('mongoose')
require('dotenv/config');

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000'

var access_token = null
var token_type = null

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const apiClient = axios.create({
    baseURL: "https://api.spotify.com/v1/"
})

const stateKey = 'spotify_auth_state'

router.get('/login', (req, res) => {

    const state = generateRandomString(16)
    res.cookie(stateKey, state)

    const scope = ["user-library-read", "playlist-read-private", "streaming", "user-modify-playback-state", "user-read-playback-state"];

    const searchParams = `client_id=${CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${REDIRECT_URI}&` +
        `state=${state}&` +
        `scope=${scope.join(
            "%20")}&` +
        `show_dialog=true&`


    res.json({
        spotifyUrl: `https://accounts.spotify.com/authorize?${searchParams}`
    })
    console.log(`https://accounts.spotify.com/authorize?${searchParams}`)
})

router.post('/', (req, res) => {
    const code = req.body.code || null
    console.log("this is the code" + code)


    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}&`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        }
    })
        .then(response => {
            console.log('Response data:', response.data);

            if (response.status === 200) {
                console.log('success token')

                access_token = response.data.access_token
                token_type = response.data.token_type
                res.status(response.status).json({ error: 'Failed to obtain access token' });
            } else {
                res.json(response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('not success token')
            res.status(500).json({ error: 'An error occurred while processing the request' });
        })
})

router.get('/refresh_token', (req, res) => {
    const refresh_token = req.body || null

    axios({
        method: 'post',
        url: 'https://acounts.spotify.com/api/token',
        data: `grant_type=refresh_token&refresh_token=${refresh_token}`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        }
    })
        .then(response => {
            res.send(response.data)
        })
        .catch(error => {
            res.send(error)
        })
})

router.get('/profile', (req, res) => {
    axios.get('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(async response => {
            res.json(response.data);

            console.log(response.data)
            const userData = { username: response.data.display_name, spotifyUserHref: response.data.href }
            console.log(userData)
            const user = new schemas.UsersProfile(userData)
            try {
                const saveUser = await user.save()
                console.log('user saved')
            } catch (error) {
                console.log('error saving user' + error)
            }
        })
        .catch(error => {
            res.json(error);
        });

})

router.get('/library', (req, res) => {
    axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json(error);
        });
})

router.get('/playlist', (req, res) => {
    const key = req.query.key
    axios.get(`https://api.spotify.com/v1/playlists/${key}/tracks`, {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            res.json(error);
        });
})

router.get('/currentlyPlaying', (req, res) => {
    axios.get('http://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            res.json(error);
        });
})

router.get('/search', (req, res) => {
    const q = req.query.input
    const type = ["album", "artist", "playlist", "track", "show", "episode", "audiobook"]
    axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type.join(
        "%2C")}`, {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            res.json(error);
        });
})

router.get('/searchUsers', async (req, res) => {
    const q = req.query.input
    console.log(q)
    try {
        const users = await schemas.UsersProfile.find({ username: { $regex: q, $options: 'i' } })
        console.log(users)

        if (users.length === 0) {
            res.json({ message: 'No users found with the given username.' });
        } else {
            res.json(users);
        }
    }
    catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'An error occurred while searching users.' });
    }
})

router.get('/getAccessToken', (req, res) => {
    // Retrieve the stored access token and send it back to the client
    res.json({ authCode: access_token });
});

router.get('/spotifyUser', (req, res) => {
    const userHref = req.query.href
    axios.get(userHref, {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(async response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            res.json(error);
        });
})

router.post('/savePost', (req, res) => {
    const { songPic, name, artists, id, message, time, albumUri } = req.body

    axios.get('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(async response => {
            res.json(response.data);
            console.log(response.data)

            const postData = { userID: response.data.id, userPic: response.data.images[1].url, content: message, songUrl: songPic, songName: name, songArtists: artists, songID: id, timeStamp: time, albumUri: albumUri }
            console.log(postData)
            const post = new schemas.PostSchema(postData)
            try {
                const savePost = await post.save()
                console.log('post saved')
            } catch (error) {
                console.log('error saving post' + error)
            }
        })
        .catch(error => {
            res.json(error);
        });
})

router.get('/seePost', async (req, res) => {
    try {
        const post = await schemas.PostSchema.find()
        console.log(post)

        if (post.length === 0) {
            res.json({ message: 'No post.' });
        } else {
            res.json(post);
        }
    }
    catch (error) {
        console.error('Error getting post:', error);
        res.status(500).json({ message: 'An error occurred while getting post.' });
    }
})

router.get('/getTrack', (req, res) => {
    const trackID = req.query.trackID
    const formatted = spotifyTrackURI.split(':')[2].replace(/:/g, '%3A');
    console.log(formatted)
    axios.get(`https://api.spotify.com/v1/tracks/${formatted}`, {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(async response => {
            res.json(response);
            console.log(response)
        })
        .catch(error => {
            res.json(error);
        });
})

router.post('/queue', (req, res) => {
    const uri = req.body.trackID
    axios.post('https://api.spotify.com/v1/me/player/queue?uri=' + encodeURIComponent(uri), {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(async response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            res.json(error);
            console.log(error)
        });
})


router.put('/playSong', (req, res) => {
    const { trackID, albumId } = req.body
    console.log(trackID + albumId)
    const data = {
        context_uri: albumId,
        uris: [trackID],
        offset: {
            uri: trackID,
        },
        position_ms: 0,
    };
    axios.put(`https://api.spotify.com/v1/me/player/play`, data, {
        headers: {
            Authorization: `${token_type} ${access_token}`,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            console.log('Track is now playing:', response.data);
        })
        .catch((error) => {
            console.log(error)
            console.error('Error playing the track:', error);
            res.status(500).json({ error: 'Error playing the track' });
        });
})

router.get('/usersPlaylist', (req, res) => {
    const userID = req.query.id
    axios.get(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            res.json(error);
        });
})

router.get('/getDevices', (req, res) => {
    axios.get("https://api.spotify.com/v1/me/player/devices", {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(response => {
            res.json(response.data);
            console.log(response.data)
        })
        .catch(error => {
            res.json(error);
        });
})

router.put('/transferDevice', (req, res) => {
    const { deviceID } = req.body
    console.log(deviceID)
    const data = {
        device_ids: [deviceID],
    }
    axios.put("https://api.spotify.com/v1/me/player", data, {
        headers: {
            Authorization: `${token_type} ${access_token}`
        }
    })
        .then(response => {
            res.json(response.data);
            console.log(response.data)
            console.log('success')
        })
        .catch(error => {
            console.log(error)
            res.json(error);
            console.log('no success')

        });
})

module.exports = router