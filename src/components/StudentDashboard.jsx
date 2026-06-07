import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const subjects = [
    { id: 'math', name: 'Math', posts: 24 },
    { id: 'physics', name: 'Physics', posts: 18 },
    { id: 'chemistry', name: 'Chemistry', posts: 15 },
    { id: 'biology', name: 'Biology', posts: 12 },
    { id: 'english', name: 'English', posts: 20 },
    { id: 'history', name: 'History', posts: 10 },
  ];

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="student-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name} {user?.surname}</h1>
            <p className="subtitle">Student Dashboard - Grade {user?.grade} - {user?.class}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="subjects-section">
          <h2>My Subjects</h2>
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
        </div>
      </div>
    </div>
  );
}
