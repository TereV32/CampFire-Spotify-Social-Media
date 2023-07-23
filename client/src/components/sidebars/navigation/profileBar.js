import React, { useEffect, useState } from 'react'
import {
    Nav,
    Container,
    Row,
    Col,
    Button
} from 'react-bootstrap'
import {
    HouseExclamation,
    MusicNoteList, PlayFill, PlusSquare, Search
} from 'react-bootstrap-icons'
import '../navigation/profileBar.css'
import BarButtons from '../barButtons'
import axios from 'axios'
import CreatePost from '../../createPost'


export default function ProfileBar() {

    const date = new Date()

    const [profilePic, setProfilePic] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [time, setTime] = useState('')
    const [expires, setExpires] = useState('')

    const [show, setShow] = useState(true);
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false);

    console.log(show)


    const [authCode, setAuthCode] = useState('')

    useEffect(() => {
        // // Check if there's an access token in the URL (i.e., if it's a callback from Spotify)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        // if (time < expires || authCode !== code) {
        //     console.log('1')
        //     refreshToken()
        // } else {
        //     console.log('2')
        getData()
        // }
        getUserProfile()
    }, [])

    async function getData() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        setAuthCode(code)
        console.log(code + 'this is new code')

        if (code) {
            // Set the access token in state and clear the URL parameters
            setAuthCode(code);
            console.log(code)

            await axios.post('http://localhost:3001/', { code })
                .then((response) => {
                    setTime(Date.now())
                    console.log(response.data)
                    setExpires(time + response.data.expires_in * 1000)
                })
                .catch((error) => {
                    console.error(error)
                })
            // window.history.replaceState({}, document.title, '/'); // Remove the access token from the URL
        }
    }

    async function refreshToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Set the access token in state and clear the URL parameters
            setAuthCode(code);
            console.log(code)

            await axios.post('http://localhost:3001/refresh_token', { code })
                .then((response) => {
                    setTime(Date.now())
                    console.log(response.data)
                    setExpires(time + response.data.expires_in * 1000)
                    setAuthCode(response.data.refresh_token)
                })
                .catch((error) => {
                    console.error(error)
                })
            // window.history.replaceState({}, document.title, '/'); // Remove the access token from the URL
        }
    }

    async function getUserProfile() {
        await axios.get('http://localhost:3001/profile')
            .then((response) => {
                console.log(response.data)
                setDisplayName(response.data.display_name)
                setProfilePic(response.data.images[1].url)
            })
            .catch((error) => {
                console.error(error)
            })
    }



    return (
        <Container id='side-bar-container' >
            <Nav className='flex-column' style={{ padding: '10px' }}>
                <Container fluid className={'p-0 m-0'}>
                    <Nav.Item>
                        <Row>
                            <Col>
                                <img src={profilePic} className='img-prof' alt="profile" />
                            </Col>
                            <Col>
                                <h5 style={{ color: '#eaefd2' }}>{displayName}</h5>
                            </Col>
                        </Row>
                    </Nav.Item>
                    <BarButtons title="Search" to="/search" icon={<Search />} />
                    <BarButtons title="Library" to="/library" icon={<MusicNoteList />} />
                    <BarButtons title="Feed" to="/feed" icon={<HouseExclamation />} />
                </Container>
            </Nav>
        </Container >
    )
}
