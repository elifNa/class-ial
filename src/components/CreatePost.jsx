import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

export default function CreatePost() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { user } = useAuth();
  const [category, setCategory] = useState('announcement');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const categories = [
    { id: 'announcement', label: 'Announcement' },
    { id: 'homework', label: 'Homework' },
    { id: 'exam', label: 'Exam' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement post creation with Supabase
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/teacher-dashboard');
    }, 2000);
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
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={user?.subject || ''}
                disabled
                className="disabled-input"
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
              />
            </div>
            
            <button type="submit" className="submit-button">
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
