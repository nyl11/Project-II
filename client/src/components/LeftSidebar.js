import React from 'react'
import { FaHome } from 'react-icons/fa'
import { BiPencil  } from 'react-icons/bi'
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
  <div className="sidebar-item home_btn">
    <Link to="/login"><FaHome size={22} /> Home</Link>
  </div>
  <div className="sidebar-item my_post">
    <Link to="/my-posts"><BiPencil size={22} /> My Posts</Link>
  </div>
</div>

  )
}

export default LeftSidebar
