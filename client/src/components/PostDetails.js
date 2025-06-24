import { usePostsContext } from "../hooks/usePostsContext";
import { FaTrash, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const PostDetails = ({ post, canDelete = false }) => {
  const { dispatch } = usePostsContext();
  const [voteType, setVoteType] = useState(null);

  // Detect if the current user has voted
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    const voteRecord = post.votedUsers?.find(v => v.userId === userId);
    setVoteType(voteRecord ? voteRecord.voteType : null);
  }, [post.votedUsers]);

  // Handle delete
  const handleClick = async () => {
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
  };

  // Handle vote
  const handleVote = async (voteChange) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) return;

    const response = await fetch(`/api/posts/${post._id}/vote`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ voteChange })
    });

    const json = await response.json();

    if (!response.ok) {
      alert(json.error);
      return;
    }

    // Update global context
    dispatch({
      type: 'UPDATE_POST_VOTE',
      payload: {
        postId: post._id,
        votes: json.votes,
        votedUsers: json.votedUsers,
      }
    });
  };

  return (
    <div className="post-details">
      <h4>{post.title}</h4>
      <p><strong>Author:</strong> {post.username}</p>
      <p>{post.content}</p>
      <p>{post.image}</p>
      <p>{post.url}</p>
      <p><strong>Comments:</strong> {post.commentsCount}</p>
      <p>{new Date(post.createdAt).toLocaleString()}</p>

      {/* Voting UI */}
      <div className="votes">
        <button
          onClick={() => handleVote(1)}
          style={{ color: voteType === 'up' ? 'green' : 'black' }}
        >
          <FaThumbsUp />
        </button>

        <span style={{ margin: "0 10px" }}>{post.votes}</span>

        <button
          onClick={() => handleVote(-1)}
          style={{ color: voteType === 'down' ? 'red' : 'black' }}
        >
          <FaThumbsDown />
        </button>
      </div>

      {/* Delete button */}
      {canDelete && (
        <span onClick={handleClick} className="delete-button">
          <FaTrash size={20} />
        </span>
      )}
    </div>
  );
};

export default PostDetails;
