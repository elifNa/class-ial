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

  const allSubjects = [
    { id: 'math', name: 'Matematik', dbName: 'Math' },
    { id: 'chemistry', name: 'Kimya', dbName: 'Chemistry' },
    { id: 'biology', name: 'Biyoloji', dbName: 'Biology' },
    { id: 'physics', name: 'Fizik', dbName: 'Physics' }
  ];

  useEffect(() => {
    if (user?.className) {
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
        setSubjects(allSubjects.map(subj => ({ ...subj, posts: 0 })));
        return;
      }
      
      // Count posts for each predefined subject
      const subjectCounts = posts.reduce((acc, post) => {
        const subject = post.subject || 'General';
        acc[subject] = (acc[subject] || 0) + 1;
        return acc;
      }, {});
      
      // Map all predefined subjects with their post counts (using dbName for database lookup)
      const subjectsArray = allSubjects.map(subj => ({
        ...subj,
        posts: subjectCounts[subj.dbName] || 0
      }));
      
      setSubjects(subjectsArray);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setSubjects(allSubjects.map(subj => ({ ...subj, posts: 0 })));
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
            <h1>{user?.fullName}</h1>
            <p className="subtitle">Öğrenci Paneli - Sınıf {user?.className}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>

        <div className="subjects-section">
          <h2>Derslerim</h2>
          {loading ? (
            <p>Dersler yükleniyor...</p>
          ) : subjects.length === 0 ? (
            <p>Henüz gönderi yok.</p>
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
                    <p>{subject.posts} gönderi</p>
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
