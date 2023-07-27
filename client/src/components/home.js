import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Library from './library/library'
import Feed from './feed/feed'
import '../css/home.css'
import ProfileBar from './sidebars/navigation/profileBar'
import Login from './login'
import PlayingBar from './sidebars/currentlyPlaying/playingBar'
import SearchResults from './search/searchResults'
import WhosListening from './sidebars/whosListening/whosListening'
import { TrackProvider } from '../trackContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import baseUrl from '../config'

export default function Home() {

    const date = new Date()


    const [refreshCode, setRefreshCode] = useState('')
    const [time, setTime] = useState('')
    const [expires, setExpires] = useState('')
    const [statusCode, setStatusCode] = useState(200)

    const [authCode, setAuthCode] = useState('')

    useEffect(() => {
        getData()
        const interval = setInterval(() => setTime(Date.now()), 3600000);
        return () => {
            clearInterval(interval);
        }
    }, [statusCode])

    async function getData() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        setAuthCode(code)

        if (code) {
            // Set the access token in state and clear the URL parameters
            setAuthCode(code);
            console.log(code)

            await axios.post(`${baseUrl}/`, { code })
                .then((response) => {
                    const currentTime = (Date.now())
                    setTime(Date.now())
                    console.log(response.data)
                    setExpires(currentTime + response.data.expires_in * 1000)
                    setRefreshCode(response.data.refresh_token)
                })
                .catch((error) => {
                    console.error(error)
                })

            console.log(time)

            if (isAccessTokenExpiring()) {
                refreshToken();
                console.log(code + 'this is new code')
            }
            // window.history.replaceState({}, document.title, '/'); // Remove the access token from the URL
        }
    }

    async function refreshToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (refreshCode) {
            // Set the access token in state and clear the URL parameters
            await axios.post(`${baseUrl}/refresh_token`, { refreshCode })
                .then((response) => {
                    setTime(Date.now())
                    console.log(response.data)
                    setExpires(time + response.data.expires_in * 1000)
                    setAuthCode(response.data.access_token)
                    setRefreshCode(response.data.refreshCode)

                })
                .catch((error) => {
                    console.error(error)
                })
            // window.history.replaceState({}, document.title, '/'); // Remove the access token from the URL
        }
    }

    const isAccessTokenExpiring = () => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        if (statusCode === 401) {
            console.log('true')
            return true
        } else {
            console.log(time + " " + expires)
            console.log('false')
            return false
        };
    }

    {
        authCode ? (
            <Router>
                <div className='app-container'>
                    <TrackProvider>
                        <div className='profile-bar'>
                            <ProfileBar />
                        </div>
                        <div style={{ width: '69.5%' }}>
                            <Routes>
                                <Route path='/search' element={<SearchResults />} />
                                <Route path='/' element={<Feed />} />
                                <Route path='/login' element={<Login />} />
                                <Route path='/feed' element={<Feed />} />
                                <Route path='/library' element={<Library />} />
                            </Routes>

                        </div>
                        <div style={{ width: '18%' }}>
                            <WhosListening />
                        </div>
                        {/* <div> */}
                        <PlayingBar />
                        {/* </div> */}
                    </TrackProvider>
                </div>
            </Router>
        ) : (<Login />)
    }
}

