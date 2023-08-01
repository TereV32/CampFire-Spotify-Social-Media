import axios from "axios";
import baseUrl from "../config";

const WebPlayback = async (setPlayer, setPaused, setActive, setTrack, setCurrentTime, setTimeBar) => {

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

    const is_paused = setPaused


    const response = await axios.get(`${baseUrl}/getAccessToken`)
    const accessCode = response.data.authCode

    const script = document.createElement("script");
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

        // setPlayer(player);

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
            console.log(state.track_window.current_track)

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

        setPlayer(player)

    };
}

export default WebPlayback