# Supabase Database Setup Guide

## Required Tables

### 1. `teachers` table
```sql
CREATE TABLE teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  subject TEXT NOT NULL,
  classes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `students` table
```sql
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  grade TEXT NOT NULL,
  class_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. `teacher_classes` table
```sql
CREATE TABLE teacher_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES teachers(id),
  class_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. `posts` table
```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('announcement', 'homework', 'exam')),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  class_name TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id),
  teacher_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

Enable RLS on all tables:

```sql
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

### Teachers table policies
```sql
-- Teachers can read their own profile
CREATE POLICY "Teachers can view own profile"
  ON teachers FOR SELECT
  USING (auth.uid() = user_id);

-- Teachers can update their own profile
CREATE POLICY "Teachers can update own profile"
  ON teachers FOR UPDATE
  USING (auth.uid() = user_id);
```

### Students table policies
```sql
-- Students can read their own profile
CREATE POLICY "Students can view own profile"
  ON students FOR SELECT
  USING (true);

-- Anyone can read students for login verification
CREATE POLICY "Public read for login"
  ON students FOR SELECT
  USING (true);
```

### Teacher classes policies
```sql
-- Teachers can read their assigned classes
CREATE POLICY "Teachers can view their classes"
  ON teacher_classes FOR SELECT
  USING (teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
  ));
```

### Posts policies
```sql
-- Teachers can create posts
CREATE POLICY "Teachers can create posts"
  ON posts FOR INSERT
  WITH CHECK (teacher_id IN (
    SELECT id FROM teachers WHERE user_id = auth.uid()
  ));

-- Students can read posts for their class
CREATE POLICY "Students can view class posts"
  ON posts FOR SELECT
  USING (true);

-- Teachers can read posts for their classes
CREATE POLICY "Teachers can view their class posts"
  ON posts FOR SELECT
  USING (class_name IN (
    SELECT class_name FROM teacher_classes 
    WHERE teacher_id IN (
      SELECT id FROM teachers WHERE user_id = auth.uid()
    )
  ));
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Run the SQL commands above in the Supabase SQL Editor
3. Copy your project URL and anon key from Supabase settings
4. Add them to your `.env` file
5. Restart the development server
