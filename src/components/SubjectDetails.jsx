import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SubjectDetails.css';

export default function SubjectDetails() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const [filter, setFilter] = useState('all');

  const subjectNames = {
    math: 'Math',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    english: 'English',
    history: 'History'
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'homework', label: 'Homework' },
    { id: 'exam', label: 'Exams' }
  ];

  const posts = [
    {
      id: 1,
      category: 'homework',
      title: 'Chapter 5 Exercises',
      content: 'Complete exercises 5.1 to 5.10 by Friday. Show all your work.',
      timestamp: '2m ago',
      author: 'by Alice Wilson'
    },
    {
      id: 2,
      category: 'announcement',
      title: 'Extra Tutoring Session',
      content: 'There will be an extra tutoring session this Thursday at 3 PM in Room 201.',
      timestamp: '2h ago',
      author: 'by James Show'
    },
    {
      id: 3,
      category: 'exam',
      title: 'Midterm Exam Schedule',
      content: 'Midterm exam will be held on Monday, March 15th. Chapters 1-4 will be covered.',
      timestamp: '1d ago',
      author: 'by Alice Wilson'
    },
    {
      id: 4,
      category: 'homework',
      title: 'Lab Report Due',
      content: 'Lab report for Experiment 3 is due next Wednesday. Include all data analysis.',
      timestamp: '2d ago',
      author: 'by James Show'
    }
  ];

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

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
    <div className="subject-details">
      <div className="container">
        <div className="subject-details-content">
          <button className="back-button" onClick={() => navigate('/student-dashboard')}>
            ← Back
          </button>
          
          <div className="subject-header">
            <h1>{subjectNames[subjectId] || subjectId}</h1>
            <p className="grade-info">Grade 10 - 10A</p>
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
                <p className="post-author">{post.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
