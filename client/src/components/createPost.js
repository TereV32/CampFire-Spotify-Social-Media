import React, { useState } from 'react'
import axios from 'axios';
import {
    Modal,
    Form,
    Dropdown,
    Button
} from 'react-bootstrap'
import baseUrl from '../config'

export default function CreatePost({ closeOpen }) {

    const [inputSearch, setInputSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true)

    async function search() {
        await axios.get(`${baseUrl}/search`, { params: { input: inputSearch } })
            .then((response) => {
                console.log(response.data)
                // onSearch(input)
                setSearchResults(response.data.albums.items)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return (
        <Modal size="lg"
        aria-labelledby="contained-modal-title-vcenter" centered style={{backgroundColor: '#ffffff'}}show={closeOpen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Song
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={inputSearch}
                                        onChange={(e) => {
                                            setInputSearch(e.target.value);
                                            search(); // Call the search function on each change in input value
                                        }}
                                    />
                                </Form.Group>
                            </Form>
                            {/* Display search results */}
                            {searchResults.map((result, index) => (
                                <Dropdown.Item key={index}>{result.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Post Message </Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Post
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
