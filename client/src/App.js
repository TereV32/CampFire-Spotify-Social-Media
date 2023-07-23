import { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios'
import Home from './components/home'
import Login from './components/login'

function App() {

  return (
    <div className="App">
      {<Home />}
    </div>
  );
}

export default App;
