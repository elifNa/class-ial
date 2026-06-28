import { useNavigate } from 'react-router-dom';
import './LoginSelection.css';

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="login-selection">
      <div className="container">
        <div className="login-selection-content">
          <div className="brand">
            <h1>İzmir Atatürk Lisesi ClassİAL</h1>
          </div>
          
          <div className="login-options">
            <h2>Giriş Yap</h2>
            
            <button 
              className="login-card"
              onClick={() => navigate('/teacher-login')}
            >
              <div className="login-card-icon">👨‍🏫</div>
              <div className="login-card-content">
                <h3>Öğretmen</h3>
                <p>Sınıflarınıza erişin ve öğrenciler için gönderiler oluşturun</p>
              </div>
            </button>
            
            <button 
              className="login-card"
              onClick={() => navigate('/student-login')}
            >
              <div className="login-card-icon">👨‍🎓</div>
              <div className="login-card-content">
                <h3>Öğrenci</h3>
                <p>Derslerinizi görüntüleyin ve sınıf gönderileriyle güncel kalın</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
