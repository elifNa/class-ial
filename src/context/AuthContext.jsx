import { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginTeacher = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Fetch teacher profile data - teachers.id maps directly to auth.users.id
      const { data: profile, error: profileError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (profileError) {
        throw new Error('Teacher profile not found. Please contact administrator.');
      }
      
      if (!profile) {
        throw new Error('Teacher profile not found. Please contact administrator.');
      }
      
      const teacherData = {
        id: profile.id,
        email: data.user.email,
        firstName: profile.first_name,
        lastName: profile.last_name
      };
      
      setUser(teacherData);
      return teacherData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginStudent = async (studentNumber) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_number', studentNumber)
        .single();
      
      if (error) throw error;
      
      const studentData = {
        id: data.id,
        studentNumber: data.student_number,
        fullName: data.full_name,
        className: data.class_name.trim().toUpperCase()
      };
      
      setUser(studentData);
      return studentData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginTeacher, loginStudent, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
