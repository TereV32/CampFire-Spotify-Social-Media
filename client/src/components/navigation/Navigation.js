import React, { useEffect, useState } from "react";
import "./navigation.css";
import { Container, Dropdown, Nav, NavDropdown, NavItem } from "react-bootstrap";
import baseUrl from "../../config";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Navigation(code) {

  const [displayName, setDisplayName] = useState('')
  const [profilePic, setProfilePic] = useState('')



  useEffect(() => {
    getUserProfile()
  }, [code])


  async function getUserProfile() {
    await axios.get(`${baseUrl}/profile`)
      .then((response) => {
        console.log(response.data)
        setDisplayName(response.data.display_name)
        setProfilePic(response.data.images[1].url)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <header id="header">
      <Container id="logo">
        <div id="CAMPFIRE">
          <span id="text-wrapper">CAMP</span>
          <span id="span">FIRE</span>
        </div>
      </Container>
      <Nav id="menu">
        <Nav.Link id='div' as={Link} to="/">Home</Nav.Link>
        <Nav.Link id='text-wrapper-2' as={Link} to="/library">Library</Nav.Link>
        <Nav.Link id='text-wrapper-3' as={Link} to="/search">Search</Nav.Link>
        {/* <div id="div">Home</div>
        <div id="text-wrapper-2">Library</div>
        <div id="text-wrapper-3">Search</div> */}
      </Nav>
      <Container id="dropdown-list-header">
        <Dropdown>
          <Dropdown.Toggle variant="light" id="avatar-label-group">
            <div id='avatar'>
              <img id='avatar' src={profilePic} />
              {/* <div id="avatar-online" /> */}
            </div>
            <div id="text-and-supporting">
              <div id="text">{displayName}</div>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {/* Add menu items here if needed */}
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </header>
  );
};
