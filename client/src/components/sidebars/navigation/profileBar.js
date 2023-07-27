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
import baseUrl from '../../../config'

export default function ProfileBar() {

    const date = new Date()

    const [profilePic, setProfilePic] = useState('')
    const [displayName, setDisplayName] = useState('')

    const [refreshCode, setRefreshCode] = useState('')
    const [time, setTime] = useState('')
    const [expires, setExpires] = useState('')
    const [statusCode, setStatusCode] = useState(200)

    const [show, setShow] = useState(true);


    const [authCode, setAuthCode] = useState('')

    useEffect(() => {
        getData()
        // }
        getUserProfile()
        const interval = setInterval(() => setTime(Date.now()), 3600000);
        return () => {
            clearInterval(interval);
        }
    }, [statusCode])

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
                    setExpires(currentTime + response.data.expires_in * 1000)
                    setRefreshCode(response.data.refresh_token)
                })
                .catch((error) => {
                    console.error(error)
                })

            console.log(time)

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
                    console.error(error)
                })
            // window.history.replaceState({}, document.title, '/'); // Remove the access token from the URL
        }
    }

    const isAccessTokenExpiring = () => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        if (statusCode === 401) {
            console.log('true')
            return true
        } else {
            console.log(time + " " + expires)
            console.log('false')
            return false
        };
    }

    async function getUserProfile() {
        await axios.get(`${baseUrl}/profile`)
            .then((response) => {
                console.log(response.data)
                if (response.data.status === 401) {
                    setStatusCode(401)
                }
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
                    <Nav.Item style={{ marginBottom: '200px' }}>
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
