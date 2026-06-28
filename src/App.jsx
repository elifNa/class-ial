import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginSelection from './components/LoginSelection';
import TeacherLogin from './components/TeacherLogin';
import StudentLogin from './components/StudentLogin';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import CreatePost from './components/CreatePost';
import SubjectPosts from './components/SubjectPosts';
import ClassPosts from './components/ClassPosts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSelection />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/create-post/:classId" element={<CreatePost />} />
          <Route path="/subject/:subjectId" element={<SubjectPosts />} />
          <Route path="/class-posts/:classId" element={<ClassPosts />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
