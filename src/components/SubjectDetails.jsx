import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './SubjectDetails.css';

export default function SubjectDetails() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjectName = subjectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'Announcement', label: 'Announcements' },
    { id: 'Homework', label: 'Homework' },
    { id: 'Exam', label: 'Exams' }
  ];

  useEffect(() => {
    if (user?.className && subjectId) {
      fetchPosts();
    }
  }, [user, subjectId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('class_name', user.className.trim().toUpperCase())
        .ilike('subject', `%${subjectName}%`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        return;
      }
      
      if (!data || data.length === 0) {
        setPosts([]);
        return;
      }
      
      // Format posts with relative timestamps
      const formattedPosts = data.map(post => ({
        ...post,
        timestamp: formatTimestamp(post.created_at)
      }));
      
      setPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  const getCategoryLabel = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Homework: 'var(--warning)',
      Announcement: 'var(--primary)',
      Exam: 'var(--danger)'
    };
    return colors[category] || 'var(--secondary)';
  };

  return (
    <div className="subject-details">
      <div className="container">
        <div className="subject-details-content">
          <button className="back-button" onClick={() => navigate('/student-dashboard')}>
            ← Back
          </button>
          
          <div className="subject-header">
            <h1>{subjectName}</h1>
            <p className="grade-info">Class {user?.className}</p>
          </div>
          
          <div className="filter-toggle">
            {filters.map((f) => (
              <button
                key={f.id}
                className={`filter-button ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          
          {loading ? (
            <p>Loading posts...</p>
          ) : filteredPosts.length === 0 ? (
            <p>No posts available for this subject.</p>
          ) : (
            <div className="posts-list">
              {filteredPosts.map((post) => (
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
                  <p className="post-author">by {post.teacher_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
