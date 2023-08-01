import React, { useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    InputGroup,
    FormCheck,
    Form,
    Image,
} from 'react-bootstrap'
import baseUrl from '../config';

export default function Login() {


    async function handleLogin() {
        console.log(baseUrl)
        await axios.get(`${baseUrl}/login`)
            .then((respose) => {
                console.log(respose.data.spotifyUrl)
                window.location.href = respose.data.spotifyUrl
            }) // Initiate the login process by redirecting to the backend /login route
            .catch((error) => {
                console.log(error)
            })
        console.log('running axios')

    }

    return (
        <Container fluid className='p-4' style={{ backgroundColor: '#ffffff', height: '100vh' }}>
            <Row >
                <Col md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
                    <h1 className='my-5 display-3 fw-bold ls-tight px-3' style={{ color: '#020304' }}>
                        Camp
                        <span style={{ color: '#ef700e' }}>Fire</span>
                    </h1>
                    <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                        Connect with friends and others through music. See what everyone is listening to. <br />
                        Share your thoughts about songs, albums, artist and see what everyone else is thinking of.
                    </p>
                </Col>

                <Col md='6'>
                    <Card className='my-5' style={{ backgroundColor: '#ffffff', border: 'transparent' }}>
                        <Card.Body className='p-5'>
                            <Form>
                                <Row className='mb-4'>
                                    <Col>
                                        <Image src={require('../assets/Spotify_Logo_CMYK_Green.png')} style={{ width: 'inherit' }} />
                                    </Col>
                                </Row>
                                <Button className='w-32 mb-4' size='md' style={{ backgroundColor: '#020304', color: '#FFFFFF', fontSize: '30px' }} onClick={handleLogin}>
                                    Sign in
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

}
