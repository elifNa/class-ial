import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const loginTeacher = (name, surname) => {
    // TODO: Replace with Supabase authentication
    // Mock data for now - will be replaced with actual teacher data from Supabase
    const teacherData = {
      name: 'James',
      surname: 'Wilson',
      subject: 'Math',
      classes: ['10A', '10B', '11A']
    };
    setUser(teacherData);
    return teacherData;
  };

  const loginStudent = (studentNumber) => {
    // TODO: Replace with Supabase authentication
    const studentData = {
      studentNumber,
      name: 'Alice',
      surname: 'Johnson',
      grade: '10',
      class: '10A'
    };
    setUser(studentData);
    return studentData;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginTeacher, loginStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
