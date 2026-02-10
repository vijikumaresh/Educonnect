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

// Activity Management Types

export interface Seminar {
  id: string;
  title: string;
  topic: string;
  participants_count: number;
  seminar_date: string;
  description?: string;
  folder_id: string;
  created_at: Date | string;
}

export interface RecruitmentDrive {
  id: string;
  company_name: string;
  drive_date: string;
  participants_count: number;
  selected_count: number;
  job_role?: string;
  description?: string;
  folder_id: string;
  created_at: Date | string;
}

export interface BookOrder {
  id: string;
  book_title: string;
  author?: string;
  academic_session: string;
  quantity: number;
  order_date: string;
  student_name?: string;
  notes?: string;
  folder_id: string;
  created_at: Date | string;
}

export type ActivityType = 'seminars' | 'recruitment' | 'books';

export interface ActivitySummary {
  seminarsCount: number;
  recruitmentCount: number;
  booksCount: number;
  totalParticipants: number;
  totalSelected: number;
  totalBooksOrdered: number;
}

