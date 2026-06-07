import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const classes = user?.classes || [
    { id: '10A', name: '10A', posts: 12 },
    { id: '10B', name: '10B', posts: 8 },
    { id: '11A', name: '11A', posts: 15 },
  ];

  const handleClassClick = (classId) => {
    navigate(`/class-posts/${classId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="teacher-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name} {user?.surname}</h1>
            <p className="subtitle">Teacher Dashboard - {user?.subject || 'Subject'}</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="classes-section">
          <h2>Your Classes</h2>
          <div className="classes-grid">
            {classes.map((cls) => (
              <button
                key={cls.id}
                className="class-card"
                onClick={() => handleClassClick(cls.id)}
              >
                <div className="class-card-content">
                  <h3>{cls.name}</h3>
                  <p>{cls.posts} posts</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
