import { Student, Folder, ExamPreference } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  register: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    return response.json();
  },

  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  }
};

// Folders API
export const foldersAPI = {
  getAll: async (): Promise<Folder[]> => {
    const response = await fetch(`${API_BASE_URL}/folders`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch folders');
    return response.json();
  },

  create: async (name: string, parent_id: string | null = null): Promise<Folder> => {
    const response = await fetch(`${API_BASE_URL}/folders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, parent_id })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create folder');
    }
    return response.json();
  },

  update: async (id: string, name: string): Promise<Folder> => {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to update folder');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete folder');
  },

  move: async (id: string, newParentId: string | null): Promise<Folder> => {
    const response = await fetch(`${API_BASE_URL}/folders/${id}/move`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ parent_id: newParentId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to move folder');
    }
    return response.json();
  }
};

// Students API
export const studentsAPI = {
  getAll: async (): Promise<Student[]> => {
    const response = await fetch(`${API_BASE_URL}/students`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  create: async (student: {
    name: string;
    phone: string;
    email: string;
    college_name: string;
    address: string;
    exam_preferences: ExamPreference[];
    folder_id?: string | null;
    registration_date?: string;
  }): Promise<Student> => {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(student)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create student');
    }
    return response.json();
  },

  update: async (id: string, student: {
    name: string;
    phone: string;
    email: string;
    college_name: string;
    address: string;
    exam_preferences: ExamPreference[];
    folder_id?: string | null;
    registration_date?: string;
  }): Promise<Student> => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(student)
    });
    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete student');
  }
};


