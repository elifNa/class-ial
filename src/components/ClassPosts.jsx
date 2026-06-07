import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ClassPosts.css';

export default function ClassPosts() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { user } = useAuth();

  // Mock posts data - will be replaced with Supabase data
  const posts = [
    {
      id: 1,
      category: 'homework',
      title: 'Chapter 5 Exercises',
      content: 'Complete exercises 5.1 to 5.10 by Friday. Show all your work.',
      timestamp: '2m ago'
    },
    {
      id: 2,
      category: 'announcement',
      title: 'Extra Tutoring Session',
      content: 'There will be an extra tutoring session this Thursday at 3 PM in Room 201.',
      timestamp: '2h ago'
    },
    {
      id: 3,
      category: 'exam',
      title: 'Midterm Exam Schedule',
      content: 'Midterm exam will be held on Monday, March 15th. Chapters 1-4 will be covered.',
      timestamp: '1d ago'
    }
  ];

  const getCategoryLabel = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryColor = (category) => {
    const colors = {
      homework: 'var(--warning)',
      announcement: 'var(--primary)',
      exam: 'var(--danger)'
    };
    return colors[category] || 'var(--secondary)';
  };

  return (
    <div className="class-posts">
      <div className="container">
        <div className="class-posts-content">
          <button className="back-button" onClick={() => navigate('/teacher-dashboard')}>
            ← Back
          </button>
          
          <div className="class-header">
            <h1>Class {classId} Posts</h1>
            <p className="subject-info">{user?.subject || 'Subject'}</p>
          </div>
          
          <button 
            className="create-post-button"
            onClick={() => navigate(`/create-post/${classId}`)}
          >
            + Create New Post
          </button>
          
          <div className="posts-list">
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet for this class.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <span 
                      className="post-category"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className="post-timestamp">{post.timestamp}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
