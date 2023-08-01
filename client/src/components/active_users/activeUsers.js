import React, { useEffect, useState } from "react";
import "./activeUsers.css";
import axios from "axios";
import baseUrl from "../../config";

export default function ActiveUsers() {

  useEffect(() => {
    searchUsers()
  }, [])

  const [userSearch, setUserSearch] = useState([])
  const [userInfo, setUserInfo] = useState([])

  async function searchUsers() {
    setUserSearch([]);
    setUserInfo([]);
    try {
      const response = await axios.get(`${baseUrl}/searchUsers`, { params: { input: "" } });
      setUserSearch(response.data);

      // Fetch user information for each user found in the search
      const userPromises = response.data.map((user, i) => getSearchUsersInfo(user.spotifyUserHref, i));
      await Promise.all(userPromises); // Wait for all user info to be fetched
    } catch (error) {
      console.log(error);
    }
  }

  async function getSearchUsersInfo(href, i) {
    try {
      const response = await axios.get(`${baseUrl}/spotifyUser`, { params: { href } });
      const userData = {
        index: i,
        username: response.data.display_name,
        profilePic: response.data.images[1]?.url || 'default-profile-pic-url', // Provide a default image URL if not available
        userHref: href,
        userID: response.data.id
      };
      setUserInfo((prevUserInfo) => [...prevUserInfo, userData]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div id="family-profile">
      <div id="top">
        <div id="div-wrapper">
          <div id="text-wrapper-9">Online</div>
        </div>
      </div>
      <div id="bottom">
        {userInfo?.map((result, i) => (
          <div id="user">
            <div id="avatar-wrapper">
              <img id='avatar-2' src={result.profilePic} />
              {/* <div id="avatar-2"> */}
              {/* <img id='avatar-online' src={result.profilePic} /> */}
              {/* <div id="avatar-online" /> */}
              {/* </div> */}
            </div>
            <div id="name">{result.username}</div>
            <div id="badge">
              <div id="text-wrapper-10">Honest - Justin Bieber</div>
            </div>
          </div>
        ))}
        {/* <div id="user">
          <img id="img" alt="Avatar" src="image.png" />
          <div id="name">Jen</div>
          <div id="badge">
            <p id="text-wrapper-11">Adore You - Harry Styles</p>
          </div>
        </div>
        <div id="user">
          <img id="img" alt="Avatar" src="avatar-2.png" />
          <div id="name">Sam</div>
          <div id="badge-2">
            <div id="text-wrapper-12">Shirt - SZA</div>
          </div>
        </div>
        <div id="user">
          <img id="avatar-3" alt="Avatar" src="avatar-3.png" />
          <div id="name">Fredrick</div>
          <div id="badge">
            <p id="text-wrapper-13">Last Night - Morgan Wallen</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};
