import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import {
    SkipEndCircle,
    SkipStartCircle,
    PlayCircle,
    PauseCircle,
    Shuffle,
    Repeat,
    VolumeUp
} from 'react-bootstrap-icons'
import baseUrl from '../../../config'
import '../currentlyPlaying/playingBar.css'

export default function PlayingBar() {

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

    useEffect(() => {
        webPlayback()


    }, []);

    async function webPlayback() {

        const response = await axios.get(`${baseUrl}/getAccessToken`)
        const accessCode = response.data.authCode

        const script = document.createElement("script");
        console.log(code)
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(accessCode) },
                volume: 0.5
            });
            console.log(player)

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);
                console.log(state)
                setActive(true)


                if (state.paused !== is_paused) {
                    setPaused(state.paused); // Update pause state
                }

                if (!state.paused) {
                    const currentTimeInSeconds = Math.floor(state.position / 1000);
                    const minutes = Math.floor(currentTimeInSeconds / 60);
                    const seconds = currentTimeInSeconds % 60;
                    setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                }

            }))

            player.setName("CampFire").then(() => {
                console.log('Player name updated!');
            });

            if (is_paused) {
                player.togglePlay().then(() => {
                    console.log('Toggled playback!');
                });
            }

            // setActive(true)
            // setInterval(updateTime, 1000);

            player.connect();

        };
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
                    <p id="nowPlayingSongTittle" class="white-text">{current_track.name}</p>
                    <p id="nowPlayingSongAlbumName" class="silvery-text">{current_track.artists[0].name}</p>
                    {/* <i
                            id="likeSongButton"
                            style={{ color: 'rgb(179, 179, 179)' }}
                        ></i> */}
                </Container>
            </Container>
            <Container id="nowplayingBarCenter">
                <Container id="songControlsConatiner">
                    <Button id="shuffle" style={{ color: 'rgb(179, 179, 179)' }}>
                        <Shuffle />
                    </Button>
                    <Button id="backward" onClick={() => { player.previousTrack() }}>
                        <SkipStartCircle />
                    </Button>
                    <Container id="loading-indicator" style={{ display: 'none' }}>

                    </Container>
                    <Button id="play" style={{ display: 'block' }} onClick={() => { player.togglePlay() }}>
                        {is_paused ? <PlayCircle /> : <PauseCircle />}
                    </Button>
                    <Button id="forward" onClick={() => { player.nextTrack(); setCurrentTime(0)}}>
                        <SkipEndCircle />
                    </Button>
                    <Button id="reapeat" style={{ color: 'rgb(179, 179, 179)' }}>
                        <Repeat />
                    </Button>
                </Container>
                <Container style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <span id="songCurrentTime" class="silvery-text">
                        {currentTime}
                    </span>
                    <Container id="songTimeBarContainer">
                        <div id="songTimeBar" style={{ width: timeBar + '%' }}></div>
                        <div id="songTimeBarCircle" style={{ left: timeBar + '%' }}></div>
                    </Container>
                    <span id="songTotalTime" class="silvery-text"></span>
                </Container>
            </Container>
            <Container id="nowplayingBarRight">
                <i
                    id="fullVolume"
                    style={{ display: 'block' }}
                ><VolumeUp /></i>
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
// }
