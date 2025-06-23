import React from 'react'
import { FaHome } from 'react-icons/fa'
import { BiPencil  } from 'react-icons/bi'
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
        <Link to="/login"><FaHome size={20} /> Home</Link>
        <Link to="/my-posts"><BiPencil size={20} /> My Posts</Link>
      </div>
  )
}

export default LeftSidebar
