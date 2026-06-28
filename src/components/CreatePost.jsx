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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: 'Math',
    title: '',
    content: ''
  });

  const categories = [
    { id: 'Announcement', label: 'Announcement' },
    { id: 'Homework', label: 'Homework' },
    { id: 'Exam', label: 'Exam' }
  ];

  const subjects = [
    { id: 'Math', label: 'Math' },
    { id: 'Chemistry', label: 'Chemistry' },
    { id: 'Biology', label: 'Biology' },
    { id: 'Physics', label: 'Physics' }
  ];

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate category
    const validCategories = ['Announcement', 'Homework', 'Exam'];
    if (!validCategories.includes(category)) {
      alert('Error: Category must be exactly "Announcement", "Homework", or "Exam"');
      setLoading(false);
      return;
    }

    try {
      // Fetch current logged-in teacher's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      // Clean class name target
      const cleanedClassName = classId.trim().toUpperCase();

      // Insert new post
      const { error } = await supabase
        .from('posts')
        .insert({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: category,
          subject: formData.subject.trim(),
          class_name: cleanedClassName,
          teacher_id: user.id
        });
      
      if (error) throw error;
      
      // Show success alert and navigate back
      alert('Success', 'Post created successfully!');
      navigate(-1); // Navigate back to previous screen
    } catch (err) {
      alert('Error', `Failed to create post: ${err.message}`);
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
          <form onSubmit={handleCreatePost}>
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
              <label>Subject</label>
              <div className="category-toggle">
                {subjects.map((subj) => (
                  <button
                    key={subj.id}
                    type="button"
                    className={`category-button ${formData.subject === subj.id ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, subject: subj.id })}
                    disabled={loading}
                  >
                    {subj.label}
                  </button>
                ))}
              </div>
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
