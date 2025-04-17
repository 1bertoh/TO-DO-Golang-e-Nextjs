'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { getProfile } from '@/lib/api';

type TUser = {
  id?: number;
  username: string;
  email: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: TUser | null, token: string) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <main>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto">
            <AuthForm onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <TaskForm />
            <TaskList />
          </div>
        )}
      </div>
    </main>
  );
}