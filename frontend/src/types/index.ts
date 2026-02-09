export type ExamPreference = 'UPSC' | 'TNPSC' | 'SSC' | 'NEET' | 'BANKING' | 'RRB';

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  user_id: string;
  created_at: Date | string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  college_name: string;
  address: string;
  exam_preferences: ExamPreference[];
  folder_id?: string | null;
  registration_date?: string; // Custom date field for student registration
  created_at: Date | string;
}

export interface User {
  username: string;
  token?: string;
}

