import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TeacherLogin.css';

export default function TeacherLogin() {
  const navigate = useNavigate();
  const { loginTeacher } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginTeacher(formData.name, formData.surname);
    navigate('/teacher-dashboard');
  };

  return (
    <div className="teacher-login">
      <div className="container">
        <div className="login-form">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back
          </button>
          
          <h1>Teacher Login</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="surname">Surname</label>
              <input
                id="surname"
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                required
                placeholder="Enter your surname"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
