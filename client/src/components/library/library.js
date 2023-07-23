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
import '../library/library.css'

export default function Library() {

  const [playlists, setPlaylists] = useState(null)
  const [songs, setSongs] = useState(null)

  useEffect(() => {

    getUserPlaylists()
  }, [])

  async function getUserPlaylists() {
    await axios.get('http://localhost:3001/library')
      .then((response) => {
        console.log(response.data)
        setPlaylists(response.data.items)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function getPlaylistData(key) {
    await axios.get('http://localhost:3001/playlist', { params: { key } })
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
      <ListGroup>
        {songs?.map((item, i) => (
          <ListGroupItem className='playlist-item' key={i} >
            <div className='songList'>
              <Button className='playlist-button'>
                <Container>
                  <Row style={{ display: 'flex', width: '100%' }}>
                    <Col id='song-col'>
                      <h6>{i + 1}</h6>
                    </Col>
                    <Col id='song-col' style={{ marginTop: '10px' }}>
                      <Image style={{ height: '5vh', width: '5vh' }} src={item.track.album.images[0].url}></Image>
                    </Col>
                    <Col id='song-col'>
                      <h4 style={{ marginBottom: '2px' }}>{item.track.name}</h4>
                      <h6>{item.track.artists[0].name}</h6>
                    </Col>
                    <Col id='song-col'>
                      <h6 style={{ marginTop: '5px' }}>{item.track.album.name}</h6>
                    </Col>
                  </Row>
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
    <Container id='library-container'>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <h1 className="text-center mb-4">Playlists</h1>
          <ListGroup id='library-group'>
            {playlists?.map((item, i) => (
              <ListGroupItem id='library-item' style={{ overflowY: 'auto' }} key={i} >
                <div>
                  <Button className='playlist-button' onClick={() => handleClick(item.id)} >
                    <div>
                      <Image className='image-cover' src={item.images[0].url}></Image>
                      <h4>{item.name}</h4>
                    </div>
                  </Button>
                </div>
              </ListGroupItem>
            ))
            }
          </ListGroup >
        </div>
        <div style={{flex: '1'}}>
          <ListGroup>
            <div id='playlist-list'>
              <h1 className='text-center mb-4'>Songs</h1>
              <div className='playlist-details'>{displayPlaylist()}</div>
            </div>
          </ListGroup>
        </div>
      </div>
    </Container>
  );
};
