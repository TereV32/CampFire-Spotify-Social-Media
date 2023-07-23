import axios from 'axios'
import React, { useState } from 'react'
import SearchResults from '../../searchResults'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

export default function SearchBar() {

    const [input, setInput] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [goLink, setLink] = useState('')

    async function search() {
        await axios.get('http://localhost:3001/search', { params: { input } })
            .then((response) => {
                console.log(response.data)
                setSearchResults(response.data.albums.items)
            })
            .catch((error) => {
                console.error(error)
            })
        setLink('/search')
    }

    return (
        <Container id="searchBarContainer">
            <h5>Bootstrap 4 Search Bar</h5>
            <Container class="row">
                <Container class="col-12">
                    <Container class="input-group">
                        <input class="form-control border-secondary py-2" type="search" value={input} onChange={(e) => setInput(e.target.value)} />
                        <Container class="input-group-append">
                            <Link to={goLink}>
                                <button class="btn btn-outline-secondary" type="button" onClick={() => search()}>
                                    <i class="fa fa-search"></i>
                                </button>
                            </Link>
                        </Container>
                    </Container>
                </Container>
            </Container>
            {/* <SearchResults results={searchResults} /> */}
        </Container>
    )
}
