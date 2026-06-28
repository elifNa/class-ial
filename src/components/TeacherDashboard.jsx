import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchClasses();
    }
  }, [user]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      // Fetch teacher's classes using the teacher profile ID
      const { data: teacherClasses, error: classesError } = await supabase
        .from('teacher_classes')
        .select('class_name, id')
        .eq('teacher_id', user.id);
      
      if (classesError) {
        console.error('Error fetching classes:', classesError);
        setClasses([]);
        return;
      }
      
      if (!teacherClasses || teacherClasses.length === 0) {
        setClasses([]);
        return;
      }
      
      // Fetch post counts for each class
      const classesWithCounts = await Promise.all(
        teacherClasses.map(async (cls) => {
          const { count, error: countError } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('class_name', cls.class_name.trim().toUpperCase());
          
          return {
            id: cls.id,
            name: cls.class_name.trim().toUpperCase(),
            posts: countError ? 0 : count || 0
          };
        })
      );
      
      setClasses(classesWithCounts);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/class-posts/${classId.trim().toUpperCase()}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="teacher-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>{user?.firstName} {user?.lastName}</h1>
            <p className="subtitle">Öğretmen Paneli</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>

        <div className="classes-section">
          <h2>Sınıflarınız</h2>
          {loading ? (
            <p>Sınıflar yükleniyor...</p>
          ) : (
            <div className="classes-grid">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  className="class-card"
                  onClick={() => handleClassClick(cls.name)}
                >
                  <div className="class-card-content">
                    <h3>{cls.name}</h3>
                    <p>{cls.posts} gönderi</p>
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
