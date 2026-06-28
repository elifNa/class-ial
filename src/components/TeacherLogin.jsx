import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TeacherLogin.css';

export default function TeacherLogin() {
  const navigate = useNavigate();
  const { loginTeacher, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginTeacher(formData.email, formData.password);
      navigate('/teacher-dashboard');
    } catch (err) {
      alert('Giriş başarısız: ' + err.message);
    }
  };

  return (
    <div className="teacher-login">
      <div className="container">
        <div className="login-form">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Geri
          </button>
          
          <h1>Öğretmen Girişi</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="E-posta adresinizi girin"
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Şifrenizi girin"
                disabled={loading}
              />
            </div>
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
