import {useState} from 'react'
import{usePostsContext} from "../hooks/usePostsContext"
import { useAuthContext } from '../hooks/useAuthContext';


const PostForm = ()=>{
  const {dispatch}=usePostsContext()
  const {user}=useAuthContext()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
const [image, setImage] = useState('')
const [url, setUrl] = useState('')
const [votes, setVotes] = useState('')
const [commentsCount, setCommentsCount] = useState('')
const [error,setError ] = useState(null)

const handleSubmit = async(e)=>{
  e.preventDefault()

  if (!user){
    setError('you must be logged in')
    return
    
  }

  const post={title,content,image,url,votes,commentsCount}

  const response = await fetch('/api/posts',{
    method:'POST',
    body:JSON.stringify(post),
    headers:{
      
      'Content-Type':'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  })
  const json= await response.json()
  if(!response.ok){
    setError(json.error)
  }
  if(response.ok){
    setTitle('')
    setContent('')
    setImage('')
    setUrl('')
    setVotes('')
    setCommentsCount('')
    setError(null)
    console.log('new post added',json)
    dispatch({type: 'CREATE_POST', payload:json})
  }
}
    
    return(
      <form className="create" onSubmit={handleSubmit}>
      <h3>Create a Post</h3>

     
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      
      <textarea
      placeholder="Description"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      {/* <label>Image URL:</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      /> */}

      {/* <label>External URL (optional):</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      /> */}

      <div className='action'>
      <button type="button" title="Add Image">add image</button>
      <button type="submit">Post</button>
      </div>
      
      {error && <div className='error'>{error}</div>}
    </form>
    )
}

export default PostForm