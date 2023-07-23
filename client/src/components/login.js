import React, { useState } from 'react'
import axios from 'axios'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
} from 'react-bootstrap'
import { spotifyLogin } from '../spotify';

export default function Login() {

    async function handleLogin() {
        await axios.get('https://campfire-1f3fc409de5e.herokuapp.com/login')
            .then((respose) => {
                window.location.href = respose.data.spotifyUrl
            }) // Initiate the login process by redirecting to the backend /login route
    }

    return (
        <Container fluid className='p-4' style={{ backgroundColor: '#222529', height: '100vh' }}>

            <Row>

                {/* Description of application */}
                <Col md='6' className='align-center d-flex flex-column justify-content-center'>
                    <h1 style={{ color: '#eaefd2' }}>
                        Camp
                        <span style={{ color: '#ef700e' }}>Fire</span>
                    </h1>

                    <p style={{ color: '#eaefd2' }}>
                        Connect with friends and others through music. See what everyone is listening to.
                        Share your thoughts about songs, albums, artist and see what everyone else is thinking of.
                    </p>

                </Col>

                {/* Spotify Login/*/}

                <Col col='4' md='6'>
                    <Card className='my-5'>
                        <Card.Body className='p-5'>
                            {/* <a href={spotifyLogin}> */}
                            {/* <a href={url}> */}
                            <Button className="mb-4 w-100" size="lg" style={{ backgroundColor: '#3b5998' }} onClick={handleLogin}>
                                Continue with spotify
                            </Button>
                            {/* </a> */}
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </Container>
    );

}
