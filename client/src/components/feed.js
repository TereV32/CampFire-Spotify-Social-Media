import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {
  Button,
  Container,
  Modal,
  Form,
  Dropdown,
  Alert,
  DropdownButton
} from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import '../components/feed.css'


const MyModel = (props) =>
(<Modal show={props.isHidden} onHide={props.onClose} style={{ backgroundColor: '#FF00000' }}>
  <Modal.Header closeButton>
    <Modal.Title>Translations</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <h4>Filter:</h4>
    <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    <hr />
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={props.onClose}>Close</Button>
  </Modal.Footer>
</Modal>);


export default function Feed() {

  const [inputSearch, setInputSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const [show, setShow] = useState(false);

  const [isSong, setIsSong] = useState(false)
  const [songSelected, setSongSelected] = useState({})

  const [inputMessage, setMessage] = useState('')

  const [allPost, setAllPost] = useState([])

  useEffect(() => {
    getPost()
  }, [])


  async function getPost() {
    await axios.get('http://localhost:3001/seePost')
      .then(response => {
        setAllPost(response.data)
        console.log(response.data[0].content)
      })
      .catch(error => {
        console.log(error)
      })
  }

  function handleSongClick(name, album, artist, id) {
    const songInfo = {
      songName: name,
      albumName: album,
      artistName: artist,
      trackId: id
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
              <Button onClick={() => { handleSongClick(result.name, result.album.name, result.artists.map((artist) => artist.name), result.id) }}>
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
      <p>
        {songSelected.songName}
      </p>
    );
  }

  async function savePost() {
    console.log(songSelected)
    const response = await axios.post('http://localhost:3001/savePost', { songNum: songSelected.trackId, message: inputMessage, time: Date.now() })
  }


  async function search() {
    await axios.get('http://localhost:3001/search', { params: { input: inputSearch } })
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
      <Alert id='centeredDiv' show={show} >
        <Alert.Heading>New Post</Alert.Heading>
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

      {!show && <Button onClick={() => setShow(true)}>New Post</Button>}

      <Container>
        {allPost.map((result, i) => (
          <h1 key={i}>{result.content}</h1>
        ))}
      </Container>
    </>
  )
}
