import { useEffect } from "react";
import{usePostsContext} from "../hooks/usePostsContext"

import PostDetails from "../components/PostDetails";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import PostForm from "../components/PostForm";



const Home = () => {
  const{posts,dispatch}=  usePostsContext()

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts");
      const json = await response.json();

      if (response.ok) {
        dispatch({type:'SET_POSTS', payload:json})
      }
    };

    fetchPosts();
  }, [dispatch]);

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

export default Home;
