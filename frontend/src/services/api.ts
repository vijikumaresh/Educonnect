import { Student, Folder, ExamPreference, Seminar, RecruitmentDrive, BookOrder } from '../types';

// Use environment variable for API URL, fallback to production API for production, localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://registerstudents.kattral.ai/api' 
    : 'https://registerstudents.kattral.ai/api');

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
    try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
      
    if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
      const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
      
    return response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const backendUrl = 'https://registerstudents.kattral.ai';
        throw new Error(`Cannot connect to server. Please make sure the backend is running at ${backendUrl}`);
      }
      throw error;
    }
  },

  login: async (username: string, password: string) => {
    try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
      
    if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
      const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
      
    return response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const backendUrl = 'https://registerstudents.kattral.ai';
        throw new Error(`Cannot connect to server. Please make sure the backend is running at ${backendUrl}`);
      }
      throw error;
    }
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

// Seminars API
export const seminarsAPI = {
  getAll: async (): Promise<Seminar[]> => {
    const response = await fetch(`${API_BASE_URL}/seminars`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch seminars');
    return response.json();
  },

  getByFolder: async (folderId: string): Promise<Seminar[]> => {
    const response = await fetch(`${API_BASE_URL}/seminars/folder/${folderId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch seminars');
    return response.json();
  },

  create: async (seminar: {
    title: string;
    topic: string;
    participants_count: number;
    seminar_date: string;
    description?: string;
    folder_id: string;
  }): Promise<Seminar> => {
    const response = await fetch(`${API_BASE_URL}/seminars`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(seminar)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create seminar');
    }
    return response.json();
  },

  update: async (id: string, seminar: {
    title: string;
    topic: string;
    participants_count: number;
    seminar_date: string;
    description?: string;
  }): Promise<Seminar> => {
    const response = await fetch(`${API_BASE_URL}/seminars/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(seminar)
    });
    if (!response.ok) throw new Error('Failed to update seminar');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/seminars/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete seminar');
  }
};

// Recruitment API
export const recruitmentAPI = {
  getAll: async (): Promise<RecruitmentDrive[]> => {
    const response = await fetch(`${API_BASE_URL}/recruitment`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch recruitment drives');
    return response.json();
  },

  getByFolder: async (folderId: string): Promise<RecruitmentDrive[]> => {
    const response = await fetch(`${API_BASE_URL}/recruitment/folder/${folderId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch recruitment drives');
    return response.json();
  },

  create: async (drive: {
    company_name: string;
    drive_date: string;
    participants_count: number;
    selected_count: number;
    job_role?: string;
    description?: string;
    folder_id: string;
  }): Promise<RecruitmentDrive> => {
    const response = await fetch(`${API_BASE_URL}/recruitment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(drive)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create recruitment drive');
    }
    return response.json();
  },

  update: async (id: string, drive: {
    company_name: string;
    drive_date: string;
    participants_count: number;
    selected_count: number;
    job_role?: string;
    description?: string;
  }): Promise<RecruitmentDrive> => {
    const response = await fetch(`${API_BASE_URL}/recruitment/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(drive)
    });
    if (!response.ok) throw new Error('Failed to update recruitment drive');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/recruitment/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete recruitment drive');
  }
};

// Book Orders API
export const bookOrdersAPI = {
  getAll: async (): Promise<BookOrder[]> => {
    const response = await fetch(`${API_BASE_URL}/book-orders`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch book orders');
    return response.json();
  },

  getByFolder: async (folderId: string): Promise<BookOrder[]> => {
    const response = await fetch(`${API_BASE_URL}/book-orders/folder/${folderId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch book orders');
    return response.json();
  },

  create: async (order: {
    book_title: string;
    author?: string;
    academic_session: string;
    quantity: number;
    order_date: string;
    student_name?: string;
    notes?: string;
    folder_id: string;
  }): Promise<BookOrder> => {
    const response = await fetch(`${API_BASE_URL}/book-orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(order)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create book order');
    }
    return response.json();
  },

  update: async (id: string, order: {
    book_title: string;
    author?: string;
    academic_session: string;
    quantity: number;
    order_date: string;
    student_name?: string;
    notes?: string;
  }): Promise<BookOrder> => {
    const response = await fetch(`${API_BASE_URL}/book-orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(order)
    });
    if (!response.ok) throw new Error('Failed to update book order');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/book-orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete book order');
  }
};

