import { useNavigate } from 'react-router-dom';
import './LoginSelection.css';

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="login-selection">
      <div className="container">
        <div className="login-selection-content">
          <div className="brand">
            <h1>ClassİAL</h1>
          </div>
          
          <div className="login-options">
            <h2>Login as</h2>
            
            <button 
              className="login-card"
              onClick={() => navigate('/teacher-login')}
            >
              <div className="login-card-icon">👨‍🏫</div>
              <div className="login-card-content">
                <h3>Teacher</h3>
                <p>Access your classes and create posts for students</p>
              </div>
            </button>
            
            <button 
              className="login-card"
              onClick={() => navigate('/student-login')}
            >
              <div className="login-card-icon">👨‍🎓</div>
              <div className="login-card-content">
                <h3>Student</h3>
                <p>View your subjects and stay updated with class posts</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
