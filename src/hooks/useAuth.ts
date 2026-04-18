import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import axios from 'axios';

interface User {
  id: string;
  nom: string;
  prenom: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  const login = async (nom: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/users/login`, { nom, password });
    const { token, id, nom: userName, prenom } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify({ id, nom: userName, prenom }));

    setUser({ id: String(id), nom: userName, prenom });
    setIsAuthenticated(true);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const register = async (nom: string, prenom: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        nom, prenom, password
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };
};