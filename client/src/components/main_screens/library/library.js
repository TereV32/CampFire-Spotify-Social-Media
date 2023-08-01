import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Container,
    Button,
    ListGroup,
    ListGroupItem,
    Image,
    Row,
    Col,
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './library.css'
import baseUrl from '../../../config';

export default function Library() {

    const [playlists, setPlaylists] = useState(null)
    const [songs, setSongs] = useState(null)

    useEffect(() => {

        getUserPlaylists()
    }, [])

    async function getUserPlaylists() {
        await axios.get(`${baseUrl}/library`)
            .then((response) => {
                console.log(response.data)
                setPlaylists(response.data.items)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    async function getPlaylistData(key) {
        await axios.get(`${baseUrl}/playlist`, { params: { key } })
            .then((response) => {
                console.log(response.data)
                setSongs(response.data.items)
                console.log(response.data.items)
            })
            .catch((error) => {
                console.error(error)
                setSongs('')
            })
    }

    function displayPlaylist() {
        return (
            <ListGroup style={{ width: '100%' }}>
                {songs?.map((item, i) => (
                    <ListGroupItem id='playlist-item' key={i} >
                        <div style={{ width: '100%' }}>
                            <Button id='playlist-button'>
                                <Container id='song-list' style={{ height: 'inherit' }}>
                                    <h6 style={{ marginLeft: '3px' }}>{i + 1}</h6>
                                    <Image style={{ height: '5vh', width: '5vh', marginLeft: '30px' }} src={item.track.album.images[0].url}></Image>
                                    <div id="song-info">
                                        <h6 id="truncate">{item.track.name}</h6>
                                        <h6 id="truncate">{item.track.artists[0].name}</h6>
                                        <h6>{item.track.album.name}</h6>
                                    </div>
                                </Container>
                            </Button>
                        </div>
                    </ListGroupItem>
                ))
                }
            </ListGroup >
        )
    }

    async function handleClick(key) {
        await getPlaylistData(key)
        console.log(key)
    }

    console.log('library')
    return (
        <Container id='library'>
            <Container style={{ width: '30%' }}>
                <h1 className="text-center mb-4">Playlists</h1>
                <ListGroup id='library-group'>
                    {playlists?.map((item, i) => (
                        <ListGroupItem style={{ overflowY: 'auto', backgroundColor: 'transparent', border: 'transparent' }} key={i} >
                            <div style={{ overflowY: 'auto' }} >
                                <Button id='playlist-button' onClick={() => handleClick(item.id)} >
                                    <div id='playlist-div'>
                                        <Image className='image-cover' src={item.images[0].url}></Image>
                                        <h4 id='song-name'>{item.name}</h4>
                                    </div>
                                </Button>
                            </div>
                        </ListGroupItem>
                    ))
                    }
                </ListGroup >
            </Container>
            <Container style={{ width: '70%' }}>
                <h1 className='text-center mb-4'>Songs</h1>
                <ListGroup style={{ width: '100%' }}>
                    <div id='playlist-list'>
                        <div>{displayPlaylist()}</div>
                    </div>
                </ListGroup>
            </Container>
        </Container >
    );
};