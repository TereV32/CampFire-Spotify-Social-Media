import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Library from './library/library'
import Feed from './feed'
import '../css/home.css'
import ProfileBar from './sidebars/navigation/profileBar'
import Login from './login'
import PlayingBar from './sidebars/currentlyPlaying/playingBar'
import axios from 'axios'
import SearchResults from './searchResults'
import WhosListening from './sidebars/whosListening/whosListening'
import CreatePost from './createPost'
import {
    Modal,
} from 'react-bootstrap'

export default function Home() {

    return (
        <Router>
            <div className='app-container'>
                <div className='profile-bar'>
                    <ProfileBar />
                    <PlayingBar />
                    <WhosListening />
                </div>
                <div style={{ width: '100%' }}>
                    <Routes>
                        <Route path='/search' element={<SearchResults />} />
                        <Route path='/' element={<Feed />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/feed' element={<Feed />} />
                        <Route path='/library' element={<Library />} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

