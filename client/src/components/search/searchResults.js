import React, { useEffect, useState } from 'react'
import axios, { all } from 'axios'
import {
    Button,
    Container,
    Form,
    Row,
    Col,
    Image
} from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'
import ProfilePage from '../profilePage'
import baseUrl from '../../config'
import '../search/searchResults.css'

export default function SearchResults() {

    const [inputMusic, setInputMusic] = useState('')
    const [searchResults, setSearchResults] = useState([])


    const [inputUser, setInputUser] = useState('')
    const [userSearch, setUserSearch] = useState([])
    const [userInfo, setUserInfo] = useState([])

    const [getProfile, setGetProfile] = useState('')

    async function search() {
        await axios.get(`${baseUrl}/search`, { params: { input: inputMusic } })
            .then((response) => {
                console.log(response.data)
                setSearchResults(response.data.albums.items)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    async function searchUsers() {
        setUserSearch([]);
        setUserInfo([]);
        try {
            const response = await axios.get(`${baseUrl}/searchUsers`, { params: { input: inputUser } });
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

    async function handleUserClick(username, profilPic, id) {
        try {
            // Fetch user information for each user found in the search
            // const response = await axios.get('http://localhost:3001/spotifyUser', { params: { href } });
            const playlistResponse = await axios.get(`${baseUrl}/usersPlaylist`, { params: { id } })
            const userProfile = {
                playlists: playlistResponse.data.items,
                displayName: username,
                picture: profilPic
            }
            console.log(playlistResponse)
            console.log(userProfile) // Wait for all user info to be fetched
            setGetProfile(userProfile)
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div id='search-container' style={{ width: '100%' }}>
            <Container >
                <Row>
                    <Col sm={5} style={{ padding: '3px' }}>
                        <Button style={{ margin: '6px' }} onClick={() => search()}>
                            <Search />
                        </Button>
                        <Form.Control type="text" placeholder="Search" value={inputMusic} onChange={(e) => setInputMusic(e.target.value)} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={5} style={{ padding: '3px' }}>
                        <Button style={{ margin: '6px' }} onClick={() => searchUsers()}>
                            <Search />
                        </Button>
                        <Form.Control type="text" placeholder="search users" value={inputUser} onChange={(e) => setInputUser(e.target.value)} />
                    </Col>
                </Row>
            </Container>


            <Container style={{ display: 'flex' }}>
                <div style={{ fleex: '1' }}>
                    <h3>Search Results</h3>
                    {searchResults?.map((result, i) => (
                        <div key={i} style={{ color: '#ffffff' }}>
                            <Container style={{ height: 'inherit' }}>
                                <Row style={{ display: 'flex', width: '100%' }}>
                                    <Col id='song-col'>
                                        <h6>{i + 1}</h6>
                                    </Col>
                                    <Col id='song-col' style={{ marginTop: '10px' }}>
                                        <Image style={{ height: '5vh', width: '5vh' }} src={result.images[0].url}></Image>
                                    </Col>
                                    <Col id='song-col'>
                                        <h4 style={{ marginBottom: '2px' }}>{result.name}</h4>
                                        <h6>{result.artists[0].name}</h6>
                                    </Col>
                                    <Col id='song-col'>
                                        <h6 style={{ marginTop: '42px' }}>{result.name}</h6>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    ))}
                    {userInfo?.map((result, i) => (
                        <div key={i} style={{ color: '#ffffff' }}>
                            <Button onClick={() => { handleUserClick(result.username, result.profilePic, result.userID) }}>
                                <h4>{result.username}</h4>
                                <img src={result.profilePic} alt={result.username} width="100" height="100" />
                            </Button>
                        </div>
                    ))}
                </div>
            </Container>
            <Container style={{ flex: '1' }}>
                <ProfilePage profile={getProfile} />
            </Container>
        </div>
    )
}
