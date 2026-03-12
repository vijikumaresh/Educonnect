use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, NaiveDate};

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct User {
    pub id: String,
    pub username: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct Folder {
    pub id: String,
    pub name: String,
    pub parent_id: Option<String>,
    pub user_id: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct Student {
    pub id: String,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub college_name: String,
    pub address: String,
    pub exam_preferences: String, // JSON array as string
    pub folder_id: Option<String>,
    pub registration_date: Option<NaiveDate>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub user_id: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub username: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateFolderRequest {
    pub name: String,
    pub parent_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateFolderRequest {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateStudentRequest {
    pub name: String,
    pub phone: String,
    pub email: String,
    pub college_name: String,
    pub address: String,
    pub exam_preferences: Vec<String>,
    pub folder_id: Option<String>,
    pub registration_date: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateStudentRequest {
    pub name: String,
    pub phone: String,
    pub email: String,
    pub college_name: String,
    pub address: String,
    pub exam_preferences: Vec<String>,
    pub folder_id: Option<String>,
    pub registration_date: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct StudentResponse {
    pub id: String,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub college_name: String,
    pub address: String,
    pub exam_preferences: Vec<String>,
    pub folder_id: Option<String>,
    pub registration_date: Option<String>,
    pub created_at: DateTime<Utc>,
}

impl From<Student> for StudentResponse {
    fn from(student: Student) -> Self {
        let exam_preferences: Vec<String> = serde_json::from_str(&student.exam_preferences)
            .unwrap_or_default();
        
        StudentResponse {
            id: student.id,
            name: student.name,
            phone: student.phone,
            email: student.email,
            college_name: student.college_name,
            address: student.address,
            exam_preferences,
            folder_id: student.folder_id,
            registration_date: student.registration_date.map(|d| d.to_string()),
            created_at: student.created_at,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user id
    pub username: String,
    pub exp: usize,  // expiration time (Unix timestamp)
    pub iat: usize,  // issued at (Unix timestamp)
    pub jti: String, // JWT ID (unique token identifier)
}

// Activity Models

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct Seminar {
    pub id: String,
    pub title: String,
    pub topic: String,
    pub participants_count: i32,
    pub seminar_date: NaiveDate,
    pub description: Option<String>,
    pub folder_id: String,
    pub user_id: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateSeminarRequest {
    pub title: String,
    pub topic: String,
    pub participants_count: i32,
    pub seminar_date: String,
    pub description: Option<String>,
    pub folder_id: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSeminarRequest {
    pub title: String,
    pub topic: String,
    pub participants_count: i32,
    pub seminar_date: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct SeminarResponse {
    pub id: String,
    pub title: String,
    pub topic: String,
    pub participants_count: i32,
    pub seminar_date: String,
    pub description: Option<String>,
    pub folder_id: String,
    pub created_at: DateTime<Utc>,
}

impl From<Seminar> for SeminarResponse {
    fn from(seminar: Seminar) -> Self {
        SeminarResponse {
            id: seminar.id,
            title: seminar.title,
            topic: seminar.topic,
            participants_count: seminar.participants_count,
            seminar_date: seminar.seminar_date.to_string(),
            description: seminar.description,
            folder_id: seminar.folder_id,
            created_at: seminar.created_at,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct RecruitmentDrive {
    pub id: String,
    pub company_name: String,
    pub drive_date: NaiveDate,
    pub participants_count: i32,
    pub selected_count: i32,
    pub job_role: Option<String>,
    pub description: Option<String>,
    pub folder_id: String,
    pub user_id: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateRecruitmentRequest {
    pub company_name: String,
    pub drive_date: String,
    pub participants_count: i32,
    pub selected_count: i32,
    pub job_role: Option<String>,
    pub description: Option<String>,
    pub folder_id: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateRecruitmentRequest {
    pub company_name: String,
    pub drive_date: String,
    pub participants_count: i32,
    pub selected_count: i32,
    pub job_role: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct RecruitmentResponse {
    pub id: String,
    pub company_name: String,
    pub drive_date: String,
    pub participants_count: i32,
    pub selected_count: i32,
    pub job_role: Option<String>,
    pub description: Option<String>,
    pub folder_id: String,
    pub created_at: DateTime<Utc>,
}

impl From<RecruitmentDrive> for RecruitmentResponse {
    fn from(drive: RecruitmentDrive) -> Self {
        RecruitmentResponse {
            id: drive.id,
            company_name: drive.company_name,
            drive_date: drive.drive_date.to_string(),
            participants_count: drive.participants_count,
            selected_count: drive.selected_count,
            job_role: drive.job_role,
            description: drive.description,
            folder_id: drive.folder_id,
            created_at: drive.created_at,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct BookOrder {
    pub id: String,
    pub book_title: String,
    pub author: Option<String>,
    pub academic_session: String,
    pub quantity: i32,
    pub order_date: NaiveDate,
    pub student_name: Option<String>,
    pub notes: Option<String>,
    pub folder_id: String,
    pub user_id: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBookOrderRequest {
    pub book_title: String,
    pub author: Option<String>,
    pub academic_session: String,
    pub quantity: i32,
    pub order_date: String,
    pub student_name: Option<String>,
    pub notes: Option<String>,
    pub folder_id: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateBookOrderRequest {
    pub book_title: String,
    pub author: Option<String>,
    pub academic_session: String,
    pub quantity: i32,
    pub order_date: String,
    pub student_name: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct BookOrderResponse {
    pub id: String,
    pub book_title: String,
    pub author: Option<String>,
    pub academic_session: String,
    pub quantity: i32,
    pub order_date: String,
    pub student_name: Option<String>,
    pub notes: Option<String>,
    pub folder_id: String,
    pub created_at: DateTime<Utc>,
}

impl From<BookOrder> for BookOrderResponse {
    fn from(order: BookOrder) -> Self {
        BookOrderResponse {
            id: order.id,
            book_title: order.book_title,
            author: order.author,
            academic_session: order.academic_session,
            quantity: order.quantity,
            order_date: order.order_date.to_string(),
            student_name: order.student_name,
            notes: order.notes,
            folder_id: order.folder_id,
            created_at: order.created_at,
        }
    }
}

