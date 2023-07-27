import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
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
import { PlayBtnFill, PlusCircleFill } from 'react-bootstrap-icons';
import '../feed/feed.css'
import baseUrl from '../../config'
import TrackContext from '../../trackContext';

export default function Feed() {

  const [inputSearch, setInputSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const [show, setShow] = useState(false);

  const [isSong, setIsSong] = useState(false)
  const [songSelected, setSongSelected] = useState({})

  const [inputMessage, setMessage] = useState('')

  const [allPost, setAllPost] = useState([])
  const [trackId, setTrackId] = useState(null);

  const { setSelectedTrack } = useContext(TrackContext);

  useEffect(() => {
    getPost()
  }, [])

  async function handlePlaySong(id, albumUri) {
    try {
      const response = await axios.post(`${baseUrl}/queue`, { trackID: id });
      console.log('Track is now playing:', response.data);
      // Do something with the response if needed
    } catch (error) {
      console.error('Error playing the track:', error);
    }

  };


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

  function handleSongClick(name, album, artist, id, albumId) {
    const songInfo = {
      songName: name,
      albumName: album,
      artistName: artist,
      trackId: id,
      albumID: albumId
    }
    console.log(id)
    setSongSelected(songInfo)
    setIsSong(true)
  }

  function chooseSong() {
    return (
      <Form.Group>
        <DropdownButton id="dropdown-item-button" title="Song">
          <Form.Control type="text" placeholder="Message" rows={1} value={inputSearch} onChange={(e) => { setInputSearch(e.target.value); search() }} />
          {searchResults.map((result, i) => (
            <Dropdown.Item key={i}>
              <Button onClick={() => { handleSongClick(result.name, result.album.name, result.artists.map((artist) => artist.name), result.uri, result.album.uri) }}>
                <h4>{result.name}</h4>
                {/* <img src={result.profilePic} alt={result.username} width="100" height="100" /> */}
              </Button>
            </Dropdown.Item>
          ))}
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

  async function savePost() {
    console.log(songSelected)
    const response = await axios.post(`${baseUrl}/savePost`, { name: songSelected.songName, artists: songSelected.artistName.join(' '), id: songSelected.trackId, message: inputMessage, time: Date.now(), albumUri: songSelected.albumID })
  }

  function showPost(profilePic, content, time, song, artists, id, albumUri) {
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
      <Container id='post-background' style={{ borderRadius: '5px', marginBottom: '10px' }}>
        <div id="user-info" style={{ display: 'flex', alignItems: 'center' }}>
          <Image id='img-prof' src={profilePic} />
          {/* Add other user info like profile image, etc. here */}
        </div>
        <div id='post-info'>
          <p>
            {content}
          </p>
          <p style={{ fontSize: '9px' }}>{formattedTime}</p>
        </div>
        <div style={{ padding: '13px', alignSelf: 'center' }}>
          <p style={{ width: 'max-content', fontSize: '10px' }}>{song} {artists}</p>
          <Button id='play-button' onClick={() => handlePlaySong(id, albumUri)}>
            <PlayBtnFill size={30} />
          </Button>
        </div>
      </Container>
    )
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

  return (
    <>
      <Container id='feed-container'>
        <Alert id='centeredDiv' style={{color: '#020202'}} show={show} >
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
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => { setShow(false); savePost() }}>
              Save Changes
            </Button>
          </div>
        </Alert>

        {!show && <Button id='custom-alert' onClick={() => setShow(true)}><PlusCircleFill size={80} color='#ebefd5'/></Button>}

        <Container id='post-list' >
          {allPost.map((result, i) => (
            <div key={i}>
              {showPost(result.userPic, result.content, result.timeStamp, result.songName, result.artistName, result.songID, result.albumUri)}
            </div>
          ))}
        </Container>
      </Container>
    </>
  )
}
