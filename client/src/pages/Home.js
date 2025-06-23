import React from 'react'
import { useEffect,useState } from 'react'
//components
import PostDetails from '../components/PostDetails'
import LeftSidebar from "../components/LeftSidebar";
const Home = () => {
  const [posts,setAllPosts]= useState(null)

  //useeffect is used to call api to fetch data
  useEffect(()=>{
    const fetchAllPost= async()=>{
      const response = await fetch('/api/posts/all')
      const json = await response.json()
      
      if(response.ok) {
        setAllPosts(json)
      }
    }
    fetchAllPost()

  }, [])
  return (
    <div className="home">
      <LeftSidebar />
      <div className="allpost">
        {posts && posts.map((post) => (
         <PostDetails key={post._id} post={post}/>
        ))}
      </div>
 </div>
  )
}

export default Home
