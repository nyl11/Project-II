import { usePostsContext } from "../hooks/usePostsContext";
import {
  FaTrash,
  FaThumbsUp,
  FaThumbsDown
} from 'react-icons/fa';
import {
  FiThumbsUp,
  FiThumbsDown
} from 'react-icons/fi'; // Outline icons
import { useEffect, useState } from 'react';

const PostDetails = ({ post, canDelete = false }) => {
  const { dispatch } = usePostsContext();
  const [voteType, setVoteType] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    const voteRecord = post.votedUsers?.find(v => v.userId === userId);
    setVoteType(voteRecord ? voteRecord.voteType : null);
  }, [post.votedUsers]);

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

  const handleVote = async (voteChange) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) return;

    setLoading(true);
    try {
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

      dispatch({
        type: 'UPDATE_POST_VOTE',
        payload: {
          postId: post._id,
          votes: json.votes,
          votedUsers: json.votedUsers,
        }
      });

      // Update local voteType
      if (voteChange === 1) {
        setVoteType(voteType === 'up' ? null : 'up');
      } else if (voteChange === -1) {
        setVoteType(voteType === 'down' ? null : 'down');
      } else {
        setVoteType(null); // reset if unvoting
      }

    } catch (err) {
      alert("Failed to vote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-details">
      <h3>{post.title}</h3>
      <p><strong>Author:</strong> {post.username}</p>
      <p>{post.content}</p>
      <p>{post.image}</p>
      <p>{post.url}</p>
      <p>{new Date(post.createdAt).toLocaleString()}</p>

      <div className="votes_comment_count">
        <p>Votes:
          <span style={{ margin: "0 10px" }}>{post.votes}</span>
        </p>
        <p>Comments:
          <span style={{ margin: "0 10px" }}>{post.commentsCount}</span>
        </p>
      </div>

      {/* Voting UI */}
      <div className="votes">
        <button
          className={`vote-button ${voteType === 'up' ? 'voted-up' : ''}`}
          disabled={loading}
          onClick={() => handleVote(voteType === 'up' ? 0 : 1)}
        >
          {voteType === 'up' ? <FaThumbsUp /> : <FiThumbsUp />}
        </button>

        <button
          className={`vote-button ${voteType === 'down' ? 'voted-down' : ''}`}
          disabled={loading}
          onClick={() => handleVote(voteType === 'down' ? 0 : -1)}
        >
          {voteType === 'down' ? <FaThumbsDown /> : <FiThumbsDown />}
        </button>
      </div>

      {canDelete && (
        <span onClick={handleClick} className="delete-button">
          <FaTrash size={20} />
        </span>
      )}
    </div>
  );
};

export default PostDetails;
