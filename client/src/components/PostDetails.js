import { usePostsContext } from "../hooks/usePostsContext"
import { FaTrash } from 'react-icons/fa'

const PostDetails = ({ post })=>{
 const{dispatch}=usePostsContext()

    const handleClick = async()=>{
      const response = await fetch('/api/posts/' + post._id,{
        method: 'DELETE'
      })
      const json =  await response.json()

      if(response.ok){
        dispatch({type:'DELETE_POST', payload:json})
      }
    }
    return(
        <div className="post-details">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <p>{post.image}</p>
            <p>{post.url}</p>
            <p><strong>{post.commentsCount}</strong></p>
            <p>{post.createdAt}</p>
            <span onClick={handleClick} className="delete-button">
        <FaTrash size={20} />
      </span>
        </div>
    )
      
}

export default PostDetails