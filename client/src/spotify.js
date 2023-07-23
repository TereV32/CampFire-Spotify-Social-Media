import axios from 'axios'

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize?"
const CLIENT_ID = "7d3c71913d854614b41f4fe58d324e08"
const REDIRECT_URI = "http://localhost:3000"
const scope = ["user-library-read", "playlist-read-private"];

export const spotifyLogin = `${AUTH_ENDPOINT}client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope.join(
    "%20")}&response_type=token&showdialog=true`

const apiClient = axios.create({
    baseURL: "https://api.spotify.com/v1/"
})

export default apiClient