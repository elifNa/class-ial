import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.class) {
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      
      // Fetch posts for the student's class
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('subject')
        .eq('class_name', user.className.trim().toUpperCase());
      
      if (postsError) {
        console.error('Error fetching subjects:', postsError);
        setSubjects([]);
        return;
      }
      
      if (!posts || posts.length === 0) {
        setSubjects([]);
        return;
      }
      
      // Group posts by subject and count them
      const subjectCounts = posts.reduce((acc, post) => {
        const subject = post.subject || 'General';
        acc[subject] = (acc[subject] || 0) + 1;
        return acc;
      }, {});
      
      // Convert to array format
      const subjectsArray = Object.entries(subjectCounts).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        posts: count
      }));
      
      setSubjects(subjectsArray);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="student-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.fullName}</h1>
            <p className="subtitle">Student Dashboard - Class {user?.className}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="subjects-section">
          <h2>My Subjects</h2>
          {loading ? (
            <p>Loading subjects...</p>
          ) : subjects.length === 0 ? (
            <p>No posts available yet.</p>
          ) : (
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  className="subject-card"
                  onClick={() => handleSubjectClick(subject.id)}
                >
                  <div className="subject-card-content">
                    <h3>{subject.name}</h3>
                    <p>{subject.posts} posts</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
