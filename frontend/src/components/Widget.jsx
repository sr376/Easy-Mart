import React from 'react'
import WidgetContent from './WidgetContent'
import './CSS/Widget.css'

const Widget = () => {
  return (
 <div className="widget">
  <div className="widget-header">
    <h5>Space to follow</h5>
  </div>
  <div className="widget-content">
    <WidgetContent/>
  </div>
 </div>
  )
}

export default Widget