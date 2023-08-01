import axios from 'axios';
import React, { useState } from 'react'
import {
    Button,
    Container,
    Form,
    Dropdown,
    Alert,
    DropdownButton,
    Row,
    Col,
    Image,
} from 'react-bootstrap'
import baseUrl from '../../config';
import { PlusCircleFill } from 'react-bootstrap-icons';
import './createPost.css'

export default function CreatePost() {

    const [inputSearch, setInputSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const [show, setShow] = useState(false);

    const [isSong, setIsSong] = useState(false)
    const [songSelected, setSongSelected] = useState({})

    const [inputMessage, setMessage] = useState('')

    function handleSongClick(picUrl, name, album, artist, id, albumId) {
        const songInfo = {
            songPic: picUrl,
            songName: name,
            albumName: album,
            artistName: artist,
            trackId: id,
            albumID: albumId
        }
        console.log(songInfo)
        setSongSelected(songInfo)
        setIsSong(true)
    }


    function chooseSong() {
        return (
            <Form.Group >
                <DropdownButton id="dropdown-item-button" title="Choose Song">
                    <Form.Control type="text" placeholder="Message" rows={1} value={inputSearch} onChange={(e) => { setInputSearch(e.target.value); search() }} />
                    <div style={{ height: '300px', overflowY: 'auto' }}>
                        {searchResults.map((result, i) => (
                            <Dropdown.Item key={i}>
                                <Button id='playlist-button' onClick={() => { handleSongClick(result.album.images[0].url, result.name, result.album.name, result.artists.map((artist) => artist.name), result.uri, result.album.uri) }}>
                                    <Container id='song-list' style={{ height: 'inherit' }}>
                                        <h6 style={{ marginLeft: '3px' }}>{i + 1}</h6>
                                        <Image style={{ height: '5vh', width: '5vh', marginLeft: '30px' }} src={result.album.images[0].url}></Image>
                                        <div id="song-info">
                                            <h6 id="truncate">{result.name}</h6>
                                            <h6 id="truncate">{result.artists[0].name}</h6>
                                            <h6>{result.album.name}</h6>
                                        </div>
                                    </Container>
                                    {/* <h4>{result.name}</h4> */}
                                    {/* <img src={result.profilePic} alt={result.username} width="100" height="100" /> */}
                                </Button>
                            </Dropdown.Item>
                        ))}
                    </div>
                </DropdownButton>
            </Form.Group>
        )
    }

    function showSong() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h6 style={{ color: '#ebefd5' }}>{`${songSelected.songName} ${songSelected.artistName}`}</h6>
                    </Col>
                </Row>
            </Container>
        );
    }

    async function search() {
        await axios.get(`${baseUrl}/search`, { params: { input: inputSearch } })
            .then((response) => {
                console.log(response.data)
                setSearchResults(response.data.tracks.items)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    async function savePost() {
        console.log(songSelected)
        const response = await axios.post(`${baseUrl}/savePost`, { songPic: songSelected.songPic, name: songSelected.songName, artists: songSelected.artistName.join(' '), id: songSelected.trackId, message: inputMessage, time: Date.now(), albumUri: songSelected.albumID })
        console.log(response.data)
    }

    return (
        <Container>
            <Alert id='centeredDiv' style={{ color: '#020202' }} show={show} >
                <Alert.Heading>
                    Create new post
                </Alert.Heading>
                <hr />
                <Form>
                    {isSong ? (showSong()) : (chooseSong())}
                </Form>
                <Form>
                    <Form.Group
                        className="mb-3">
                        <Form.Control tpye="text" placeholder="Message" rows={3} value={inputMessage} onChange={(e) => { setMessage(e.target.value) }} />
                    </Form.Group>
                </Form>
                <hr />
                <div className="d-flex justify-content-around">
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => { setShow(false); savePost() }}>
                        Save Changes
                    </Button>
                </div>
            </Alert>

            {!show && <Button id='custom-alert' onClick={() => setShow(true)}><PlusCircleFill size={80} color='#020304' /></Button>}
        </Container>
    )
}
