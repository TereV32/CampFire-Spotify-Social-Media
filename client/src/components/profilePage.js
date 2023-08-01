import React from 'react'
import {
    Row,
    Col,
    Image,
    ListGroup,
    ListGroupItem,
    Button
} from 'react-bootstrap'

export default function ProfilePage(profile) {

    // console.log(profile.profile.playlists.images[0].url)
    function handleClick() {

    }

    return (
        <div>
            <Row>
                <Col>
                    <Image src={profile.profile.picture} />
                    <h1 style={{ color: '#ffffff' }}>{profile.profile.displayName}</h1>
                </Col>
                <Col>
                    <ListGroup id='library-group'>
                        {profile.profile.playlists?.map((item, i) => (
                            <ListGroupItem id='library-item' style={{ overflowY: 'auto' }} key={i} >
                                <div>
                                    <Button className='playlist-button' onClick={() => handleClick(item.id)} >
                                        <div>
                                            <Image className='image-cover' src={item.images[0].url}></Image>
                                            <h4>{item.name}</h4>
                                        </div>
                                    </Button>
                                </div>
                            </ListGroupItem>
                        ))
                        }
                    </ListGroup >
                </Col>
            </Row>
        </div>
    )
}