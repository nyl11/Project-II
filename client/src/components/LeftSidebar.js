import { useLocation } from 'react-router-dom';

import { FaHome } from 'react-icons/fa'
import { BiPencil  } from 'react-icons/bi'
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  const location = useLocation();
  return (
    <div className="left-sidebar">
      <div className={`sidebar-item home_btn ${location.pathname === '/' ? 'active' : ''}`}>
        <Link to="/"><FaHome size={22} /> Home</Link>
      </div>
      <div className={`sidebar-item my_post ${location.pathname === '/createpost' ? 'active' : ''}`}>
        <Link to="/createpost"><BiPencil size={22} /> Create Post</Link>
      </div>
        <div className={`sidebar-item profile ${location.pathname === '/profile' ? 'active' : ''}`}>
        <Link to="/profile"><BiPencil size={22} /> Profile</Link>
      </div>
    </div>
  );
};

export default LeftSidebar
