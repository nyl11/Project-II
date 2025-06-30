import { usePostsContext } from "../hooks/usePostsContext";
import { FaTrash } from 'react-icons/fa';
import LikeButtons from './LikeButtons';
import { FaRegComment } from 'react-icons/fa';
import CommentSection from './CommentSection';
import ConfirmModal from './ConfirmModal';
import { useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";

const PostDetails = ({ post, canDelete = false, onCommentClick = null, onBack = null }) => {
  const { dispatch } = usePostsContext();
  const [showModal, setShowModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0); // local state for live update
   
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
      {onBack && (
        <div className="back">
        <button classNamename="back" onClick={onBack} style={{ marginBottom: '10px' }}><FaArrowLeftLong /> </button>
       
        </div>
       
      )}
  <hr></hr>
      <p><strong>Author:</strong> {post.username}</p>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>{post.image}</p>
      <p>{post.url}</p>
      <p>{new Date(post.createdAt).toLocaleString()}</p>

      <div className="votes_comment_count">
        <p>Votes: <span style={{ margin: "0 10px" }}>{post.votes}</span></p>
        <p>Comments: <span style={{ margin: "0 10px" }}>{commentsCount}</span></p>
        
      </div>

      <hr />

      <div className="like_cmt">
        <LikeButtons post={post} />
        <div className="comment">
          {onCommentClick && (
            <button onClick={() => onCommentClick(post)}>
              <FaRegComment  /> Comment
            </button>
          )}
        </div>
      </div>

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

      {/* Show comments only in single-post view */}
      {onBack && (
        <div style={{ marginTop: '20px' }}>
          <CommentSection
            postId={post._id}
            onCommentsChange={(count) => {
              setCommentsCount(count); // update local count
              dispatch({
                type: 'UPDATE_POST_COMMENTS_COUNT',
                payload: {
                  postId: post._id,
                  commentsCount: count,
                },
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PostDetails;
