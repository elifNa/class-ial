import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './ClassPosts.css';

export default function ClassPosts() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetchPosts();
    }
  }, [classId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('class_name', classId.trim().toUpperCase())
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

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} sa önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString();
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'Announcement': 'Duyuru',
      'Homework': 'Ödev',
      'Exam': 'Sınav'
    };
    return labels[category] || category;
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
    <div className="class-posts">
      <div className="container">
        <div className="class-posts-content">
          <button className="back-button" onClick={() => navigate('/teacher-dashboard')}>
            ← Geri
          </button>
          
          <div className="class-header">
            <h1>Sınıf {classId} Gönderileri</h1>
          </div>
          
          <button 
            className="create-post-button"
            onClick={() => navigate(`/create-post/${classId}`)}
          >
            + Yeni Gönderi Oluştur
          </button>
          
          {loading ? (
            <p>Gönderiler yükleniyor...</p>
          ) : (
            <div className="posts-list">
              {posts.length === 0 ? (
                <div className="no-posts">
                  <p>Bu sınıf için henüz gönderi yok.</p>
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
          )}
        </div>
      </div>
    </div>
  );
}
