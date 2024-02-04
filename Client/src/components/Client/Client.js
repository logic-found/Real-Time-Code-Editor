import React from 'react'
import './Client.scss'
import Avatar from 'react-avatar'; 

export default function Client({username}) {
  return (
    <div className="client">
        <Avatar name={username} size={35} round='7px'/>
        <span className='userName'>{username.length<10? username:username.substring(0, 10) + '..'}</span>

    </div>
  )
}
