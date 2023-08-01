import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import baseUrl from "../../config";
import axios from "axios";
import Feed from "../main_screens/feed/Feed";
import Navigation from "../navigation/Navigation";
import SearchResults from "../main_screens/search/searchResults"
import Login from "../login"
import Library from "../main_screens/library/library"
import ActiveUsers from "../active_users/activeUsers";
import PlayingBar from "../playing_bar/playingBar";
import CreatePost from "../createPost/createPost";
import './main.css'


export const Main = () => {

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
  }, [authCode, statusCode])

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
          if (response.data.status === 400) {
            setStatusCode(400)
            // isAccessTokenExpiring()
          }
          setExpires(currentTime + response.data.expires_in * 1000)
          setRefreshCode(response.data.refresh_token)
        })
        .catch((error) => {
          console.error(error)
          setStatusCode(401)
        })

      console.log(time + expires)

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
          setStatusCode(401)
          console.error(error)
        })
      // window.history.replaceState({}, document.title, '/'); // Remove the access token from the URL
    }
  }

  const isAccessTokenExpiring = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (statusCode === 400) {
      console.log('true')
      return true
    } else {
      console.log(time + " " + expires)
      console.log('false')
      return false
    };
  }

  return (
    <>
      {authCode ? (
        <Router>
          <div id="hero">
            <div id="overlap-group-wrapper">
              <div id="overlap-group">
                <Navigation code={authCode} />
                <Routes>
                  <Route path='/search' element={<SearchResults />} />
                  <Route path='/' element={<Feed />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/feed' element={<Feed />} />
                  <Route path='/library' element={<Library />} />
                </Routes>
                <ActiveUsers />
                <PlayingBar />
              </div>
            </div>
          </div>
          <div id="create-post">
            <CreatePost />
          </div>
        </Router >
      ) : (<Login />)}
    </>
  );
};