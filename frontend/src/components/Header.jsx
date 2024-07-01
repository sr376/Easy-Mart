import React, { useState } from 'react'
import HomeIcon from '@material-ui/icons/Home'
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined'
import { AssignmentTurnedInOutlined,ExpandMore,NotificationsOutlined, PeopleAltOutlined, Search } from '@material-ui/icons'
import { Avatar, Button, Input } from '@material-ui/core'
import './CSS/header.css'
import Modal from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import axios from 'axios'
import { signOut } from 'firebase/auth'
import {auth} from '../Firebase'
import { logout, selectUser } from '../feature/userSlice'
import { useDispatch, useSelector } from 'react-redux'



const Header = () => {
  const[isModalOpen,setIsModalOpen] = useState(false);
  const[inputUrl,setInputUrl] = useState("");
  const[question,setQuestion] = useState("");
  const Close = (<closeIcon/>);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

const handleSubmit = async() =>{
  if(question !== ""){

    const config = {
      headers: {
        "Content-Type":"application/json"
      }
    }

    const body = {
      questionName: question,
      questionUrl: inputUrl,
      user: user
    } 
    await axios.post('/api/questions',body,config).then((res) =>{
      console.log(res.data);
      alert(res.data.message)
      window.location.href = "/";
    }).catch((e) =>{
      console.log(e);
      alert('Error in adding question')
    })
  }
}

const handleLogout = ()=>{
  if(window.confirm('Are you sure to logout ?')){
  signOut(auth).then(()=>{
    dispatch(logout());
    console.log('Logged out');
  }).catch(()=>{
    console.log('Error in logout');
  })
  }
}

  return (
    <div className='header-container'>
      <div className="header-content">
        <div className="header-logo">
          <img src="https://video-public.canva.com/VAD8lt3jPyI/v/ec7205f25c.gif" alt="logo" />
          </div>
          <div className="header-icons">
            <div className="header-icon">
              <HomeIcon/>
              </div>
            <div className="header-icon">
              <FeaturedPlayListOutlinedIcon/>
            </div>
            <div className="header-icon"><AssignmentTurnedInOutlined/></div>
            <div className="header-icon"><PeopleAltOutlined/></div>
            <div className="header-icon"><NotificationsOutlined/></div>
          </div>
          <div className="header-input">
            <Search/>
            <input type="text" placeholder='Search' />
          </div>
          <div className="header-rem">
            <span onClick={handleLogout}> 
            <Avatar src={user?.photo} />
             </span>
        
          <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
          <Modal
          open = {isModalOpen}
          CloseIcon = {Close} onClose={() => setIsModalOpen(false)}
          closeOnEsc
          center
          closeOnOverlayClick = {false}
          styles = {{
            overlay: {
              height : "auto",
            }
          }}
          >
            <div className="modal-title">
              <h5>
              Add Question
              </h5>
              <h5>Share Link</h5>
            </div>
            <div className="modal-info">
              <Avatar src={user?.photo} className='avatar'/>
              <div className="modal-scope">
                <PeopleAltOutlined/>
                <p>Public</p>
                <ExpandMore/>
              </div>
            </div>
            <div className="modal-field">
              <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
               type='text'
                placeholder='Start your question with what,how,why,etc.'/>
              <div style={{
                display : "flex",
                flexDirection : "column"
                }}>
                <input  type="text"
                value={inputUrl}
                onChange = {(e) => setInputUrl(e.target.value)}
                 style={{
                  margin : "5px 0",
                  border : "1px solid lightgray",
                  padding : "10px",
                  outline: "2px solid #000",
                  width : "100%"
                }} placeholder='Option : include a link that given contact' />
               {inputUrl !== "" && (
                  <img
                    style={{
                      height: "40vh",
                      objectFit: "contain",
                    }}
                    src={inputUrl}
                    alt="displayimage"
                  />
                )}
              </div>
            </div>
            <div className="modal-buttons">
              <button className='cancel' onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick = {handleSubmit} type='submit' className="add">
                Add Question
              </button>
            </div>
          </Modal>
          </div>
      </div>
    </div>
  )
}

export default Header

