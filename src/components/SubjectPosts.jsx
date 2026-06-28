import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './SubjectPosts.css';

export default function SubjectPosts() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjectNames = {
    'math': 'Matematik',
    'chemistry': 'Kimya',
    'biology': 'Biyoloji',
    'physics': 'Fizik'
  };

  const subjectName = subjectNames[subjectId] || subjectId;

  useEffect(() => {
    fetchPosts();
  }, [subjectId, user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('subject', subjectName)
        .eq('class_name', user?.className?.trim().toUpperCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Announcement': return '#4CAF50';
      case 'Homework': return '#2196F3';
      case 'Exam': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'Announcement': 'Duyuru',
      'Homework': 'Ödev',
      'Exam': 'Sınav'
    };
    return labels[category] || category;
  };

  return (
    <div className="subject-posts">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Geri
        </button>
        
        <h1>{subjectName} Gönderileri</h1>
        <p className="class-info">Sınıf: {user?.className}</p>

        {loading ? (
          <p>Gönderiler yükleniyor...</p>
        ) : posts.length === 0 ? (
          <p>{subjectName} için henüz gönderi yok.</p>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <span 
                    className="post-category"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    {getCategoryLabel(post.category)}
                  </span>
                  <span className="post-date">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-content">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
