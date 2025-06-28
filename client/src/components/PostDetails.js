import { usePostsContext } from "../hooks/usePostsContext";
import { FaTrash } from 'react-icons/fa';
import LikeButtons from './LikeButtons';
import ConfirmModal from './ConfirmModal';
import { useState } from 'react';

const PostDetails = ({ post, canDelete = false }) => {
  const { dispatch } = usePostsContext();
  const [showModal, setShowModal] = useState(false);

 const handleDelete = async () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) return;

    const response = await fetch('/api/posts/' + post._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      dispatch({ type: 'DELETE_POST', payload: post._id });
    }
    setShowModal(false);
  };



  return (
    <div className="post-details">
      <p><strong>Author:</strong> {post.username}</p>
      <span><h3>{post.title}</h3></span>
      <p>{post.content}</p>
      <p>{post.image}</p>
      <p>{post.url}</p>
      <p>{new Date(post.createdAt).toLocaleString()}</p>

      <div className="votes_comment_count">
        <p>Votes:
          <span style={{ margin: "0 10px" }}>{post.votes}</span>
        </p>
        <p>Comments:
          <span style={{ margin: "0 10px " }}>{post.commentsCount}</span>
        </p>
      </div>
<hr></hr>
      <LikeButtons post={post} />

  {canDelete && (
        <>
          <span onClick={() => setShowModal(true)} className="delete-button">
            <FaTrash size={20} />
          </span>
          <ConfirmModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleDelete}
            message="Are you sure you want to delete this post?"
          />
        </>
      )}

    </div>
  );
};

export default PostDetails;
