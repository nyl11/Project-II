import { useEffect } from "react";
import{usePostsContext} from "../hooks/usePostsContext"

import PostDetails from "../components/PostDetails";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import PostForm from "../components/PostForm";
import {useAuthContext} from '../hooks/useAuthContext'



const MyPosts = () => {
  const{posts,dispatch}=  usePostsContext()

  const {user} = useAuthContext()

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts', {
        headers: {
          'Authorization': `Bearer ${user.token}`  // Use backticks for template literals
        }
      });
      const json = await response.json();
  
      if (response.ok) {
        dispatch({ type: 'SET_POSTS', payload: json });
      }
    };
  
    if (user) fetchPosts();
  
  }, [dispatch, user]);

  return (
    <div className="home">
      
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Center Post Area */}
      
      <div className="main-content " >
      <div className="posts-form" >
        <PostForm/>
      </div>
      <div className="posts-container">
        {posts &&
          posts.map((post) => <PostDetails key={post._id} post={post} />)}
      </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

export default MyPosts;
