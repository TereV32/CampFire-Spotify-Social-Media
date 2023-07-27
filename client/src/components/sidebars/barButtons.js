import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function BarButtons(props) {
    const location = useLocation()
    const isActive = location.pathname === props.to

    const btnClass = isActive ? "btn-body active" : "btn-body"



    return (
        <Link to={props.to} style={{textDecoration: 'none'}}>
            <div className={btnClass}>
                {props.icon}
                <p>{props.title}</p>
            </div>
        </Link>
    )
}
