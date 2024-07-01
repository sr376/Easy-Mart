import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Feed from './Feed'
import Widget from './Widget'
import './CSS/mainpage.css'


const mainpage = () => {
  return (
  <div>
    <Header/>
    <div className="app-contents">
      <div className="app-content">
        <Sidebar/>
        <Feed/>
        <Widget/>
       
      </div>
    </div>
  </div>
  )
}

export default mainpage