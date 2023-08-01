import React, { useEffect, useState } from "react";
import "./feed.css";
import { Container } from "react-bootstrap";
import axios from "axios";
import baseUrl from "../../../config";

export default function Feed() {

  const [allPost, setAllPost] = useState([])


  useEffect(() => {
    getPost()
  }, [])

  async function getPost() {
    await axios.get(`${baseUrl}/seePost`)
      .then(response => {
        setAllPost(response.data)
        console.log(response.data[0].content)
      })
      .catch(error => {
        console.log(error)
      })
  }

  function showPost(userID, profilePic, content, time, songUrl, song, artists, id, albumUri) {
    console.log(artists)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(time)

    return (
      <Container id="tweet">
        <Container id="tweet-2">
          <Container id="tweet-content">
            <Container id="frame">
              <div id="profile">
                <div id="avatar-wrapper">
                  <div id="avatar-online-wrapper">
                    <img id='avatar-online-wrapper' src={profilePic} />
                    {/* <div id="avatar-online-2" /> */}
                  </div>
                </div>
                <div id="profile-details">
                  <div id="user-info">
                    <div id="text-wrapper-4">{userID}</div>
                  </div>
                </div>
              </div>
              <div id="album">
                <img
                  id="rectangle"
                  alt="Rectangle"
                  src={songUrl}
                />
                <div id="text-wrapper-5">{song} - {artists}</div>
              </div>
            </Container>
            <p id="listening-to-vertigo">
              <span id="text-wrapper-6">
                {content}
              </span>
            </p>
          </Container>
          <div id="tweet-info">
            <p id="p">{formattedTime}</p>
          </div>
        </Container>
      </Container>

    )
  }

  return (
    <Container id="feed">
        <div id="title">
          <div id="feed-2">FEED</div>
        </div>
        {allPost.map((result, i) => (
          <div id='tweet' key={i}>
            {showPost(result.userID, result.userPic, result.content, result.timeStamp, result.songUrl, result.songName, result.songArtists, result.songID, result.albumUri)}
          </div>
        ))}
    </Container>
  );
};
