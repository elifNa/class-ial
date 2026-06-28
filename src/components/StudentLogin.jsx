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
      alert('Giriş başarısız: ' + err.message);
    }
  };

  return (
    <div className="student-login">
      <div className="container">
        <div className="login-form">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Geri
          </button>
          
          <h1>Öğrenci Girişi</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="studentNumber">Öğrenci Numarası</label>
              <input
                id="studentNumber"
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                required
                placeholder="Öğrenci numaranızı girin"
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
