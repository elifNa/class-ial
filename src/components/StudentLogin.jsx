import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './StudentLogin.css';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { loginStudent, loading } = useAuth();
  const [studentNumber, setStudentNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginStudent(studentNumber);
      navigate('/student-dashboard');
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div className="student-login">
      <div className="container">
        <div className="login-form">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back
          </button>
          
          <h1>Student Login</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentNumber">Student Number</label>
              <input
                id="studentNumber"
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                required
                placeholder="Enter your student number"
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
