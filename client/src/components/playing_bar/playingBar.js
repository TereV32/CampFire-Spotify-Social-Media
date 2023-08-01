import React, { createContext, useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {
    Button,
    Container,
    Image,
    Overlay,
    OverlayTrigger,
    Popover
} from 'react-bootstrap';
import {
    SkipEndCircle,
    SkipStartCircle,
    PlayCircle,
    PauseCircle,
    Shuffle,
    Repeat,
    VolumeUp,
    SpeakerFill
} from 'react-bootstrap-icons'
import './playingBar.css'
import baseUrl from '../../config';
import WebPlayback from '../webPlayback';


export default function PlayingBar({ }) {

    const track = {
        name: "",
        album: {
            images: [
                { url: "" }
            ]
        },
        artists: [
            { name: "" }
        ]
    }

    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [currentTime, setCurrentTime] = useState('0:00')
    const [timeBar, setTimeBar] = useState(0)
    const [code, setCode] = useState('')
    const [availableDevices, setAvailableDevices] = useState([])

    const [showPopover, setShowPopover] = useState(false)



    useEffect(() => {
        if (!player) {
            const initializePlayer = async () => {
                const player = await WebPlayback(setPlayer, setPaused, setActive, setTrack, setCurrentTime, setTimeBar); // Call the webPlayback function to get the player object
                setPlayer(player); // Store the player object in the state
            };
            initializePlayer();
        }
    }, []);


    async function showDevices() {
        setShowPopover(true)
        const response = await axios.get(`${baseUrl}/getDevices`)
        setAvailableDevices(response.data.devices)
        console.log(response.data.devices)
    }

    async function changePlayer(id) {
        setShowPopover(false)
        console.log(id)
        const response = await axios.put(`${baseUrl}/transferDevice`, { deviceID: id })
        console.log(response.data)
        player.activateElement()
    }

    // Update song duration
    useEffect(() => {
        let interval;
        if (!is_paused && player) {
            interval = setInterval(() => {
                player.getCurrentState().then((state) => {
                    if (state && !state.paused) {
                        const currentTimeInSeconds = Math.floor(state.position / 1000);
                        const minutes = Math.floor(currentTimeInSeconds / 60);
                        const seconds = currentTimeInSeconds % 60;
                        setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                        setTimeBar(currentTimeInSeconds)
                    }
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [is_paused, player]);


    // if (!is_active) {
    //     return (
    //         <>
    //             <div className="container">
    //                 <div className="main-wrapper" style={{color: '#ffffff'}}>
    //                     <b> Instance not active. Transfer your playback using your Spotify app </b>
    //                 </div>
    //             </div>
    //         </>)
    // } else {

    return (
        <Container id="nowplayingBarContainer">
            <Container id="nowplayingBarLeft">
                <Image id="nowplayingSonAlbumArtwork" src={current_track.album.images[0].url} />
                <Container>
                    <p id="nowPlayingSong">{current_track.name}</p>
                    <p id="nowPlayingSong">{current_track.artists[0].name}</p>
                </Container>
            </Container>
            <Container id="nowplayingBarCenter">
                <Container id="songControlsContainer">
                    <Button id='playerButton'>
                        <Shuffle size={30} color='#212121' />
                    </Button>
                    <Button id='playerButton' onClick={() => { player.previousTrack() }}>
                        <SkipStartCircle size={30} color='#212121' />
                    </Button>
                    <Container id="loading-indicator" style={{ display: 'none' }}>

                    </Container>
                    <Button id='playerButton' style={{ display: 'block' }} onClick={() => { player.togglePlay() }}>
                        {is_paused ? <PlayCircle size={30} color='#212121' /> : <PauseCircle size={30} color='#212121' />}
                    </Button>
                    <Button id='playerButton' onClick={() => { player.nextTrack(); setCurrentTime(0) }}>
                        <SkipEndCircle size={30} color='#212121' />
                    </Button>
                    <Button id='playerButton'>
                        <Repeat size={30} color='#212121' />
                    </Button>
                </Container>
                <Container style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <span id="songCurrentTime">
                        {currentTime}
                    </span>
                    <Container id="songTimeBarContainer">
                        <div id="songTimeBar" style={{ width: timeBar + '%' }}></div>
                        <div id="songTimeBarCircle" style={{ left: timeBar + '%' }}></div>
                    </Container>
                    <span id="songTotalTime"></span>
                </Container>
            </Container>
            <Container id="nowplayingBarRight">
                <OverlayTrigger
                    trigger="click"
                    show={showPopover}
                    overlay={
                        <Popover id='popover' style={{ zIndex: '999' }}>
                            <Popover.Header id='popover' as="h3">Available Devices</Popover.Header>
                            <Popover.Body id='popover'>
                                {availableDevices.map((result, i) => (
                                    <div key={i} style={{ color: '#ffffff' }}>
                                        <Button id='playerButton' onClick={() => changePlayer(result.id)}>
                                            <h4 style={{ color: '#ffffff', fontSize: '15px' }}>{result.name}</h4>
                                        </Button>
                                    </div>

                                ))}
                            </Popover.Body>
                        </Popover>
                    }
                >
                    <Button id='playerButton' onClick={() => showDevices()}> <SpeakerFill size={30} color='#212121' /></Button>
                </OverlayTrigger>
                <i
                    style={{ display: 'block', color: '#212121' }}
                ><VolumeUp size={30} /></i>
                <div id="adjustVolumeContainer">
                    <div id="volumeBarContainer">
                        <div id="volumeBar" style={{ width: '100%' }}></div>
                        <div id="circle" style={{ left: '100%' }}></div>
                    </div>
                </div>
            </Container>
            <audio id="currentPlayingSong"></audio>
        </Container>
    )
}
