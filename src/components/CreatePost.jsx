import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './CreatePost.css';

export default function CreatePost() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { user } = useAuth();
  const [category, setCategory] = useState('Announcement');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    content: ''
  });

  const categories = [
    { id: 'Announcement', label: 'Announcement' },
    { id: 'Homework', label: 'Homework' },
    { id: 'Exam', label: 'Exam' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          category,
          subject: formData.subject.trim(),
          title: formData.title.trim(),
          content: formData.content.trim(),
          class_name: classId.trim().toUpperCase(),
          teacher_id: user?.id
        });
      
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/teacher-dashboard');
      }, 2000);
    } catch (err) {
      alert('Failed to create post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <div className="container">
        <div className="create-post-content">
          <button className="back-button" onClick={() => navigate('/teacher-dashboard')}>
            ← Back
          </button>
          
          <h1>Create Post</h1>
          <p className="class-info">Class: {classId}</p>
          
          {showSuccess && (
            <div className="success-message">
              ✓ Post created successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category</label>
              <div className="category-toggle">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-button ${category === cat.id ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                    disabled={loading}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="Enter subject (e.g., Math, Physics)"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter post title"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Enter post content"
                rows={6}
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
