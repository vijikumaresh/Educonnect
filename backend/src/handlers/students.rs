use actix_web::{web, HttpResponse, HttpRequest};
use sqlx::PgPool;
use chrono::{Utc, NaiveDate};
use uuid::Uuid;
use log::{info, error};

use crate::models::{Student, StudentResponse, CreateStudentRequest, UpdateStudentRequest};
use crate::handlers::auth::extract_user_id;

pub async fn create_student(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    student_req: web::Json<CreateStudentRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Creating student for user: {}", user_id);
    
    let student_id = Uuid::new_v4().to_string();
    let now = Utc::now();
    let exam_preferences = serde_json::to_string(&student_req.exam_preferences)
        .unwrap_or_else(|_| "[]".to_string());
    
    let registration_date = student_req.registration_date.as_ref()
        .and_then(|d| NaiveDate::parse_from_str(d, "%Y-%m-%d").ok());
    
    let result = sqlx::query(
        r#"
        INSERT INTO students (id, name, phone, email, college_name, address, exam_preferences, folder_id, registration_date, created_at, updated_at, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        "#
    )
    .bind(&student_id)
    .bind(&student_req.name)
    .bind(&student_req.phone)
    .bind(&student_req.email)
    .bind(&student_req.college_name)
    .bind(&student_req.address)
    .bind(&exam_preferences)
    .bind(&student_req.folder_id)
    .bind(registration_date)
    .bind(now)
    .bind(now)
    .bind(&user_id)
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(_) => {
            info!("Student created successfully: {}", student_id);
            
            let student = Student {
                id: student_id,
                name: student_req.name.clone(),
                phone: student_req.phone.clone(),
                email: student_req.email.clone(),
                college_name: student_req.college_name.clone(),
                address: student_req.address.clone(),
                exam_preferences,
                folder_id: student_req.folder_id.clone(),
                registration_date,
                created_at: now,
                updated_at: now,
                user_id,
            };
            
            HttpResponse::Created().json(StudentResponse::from(student))
        }
        Err(e) => {
            error!("Error creating student: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to create student"
            }))
        }
    }
}

pub async fn get_students(
    pool: web::Data<PgPool>,
    req: HttpRequest,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Fetching students for user: {}", user_id);
    
    let students = sqlx::query_as::<_, Student>(
        "SELECT * FROM students WHERE user_id = $1 ORDER BY created_at DESC"
    )
    .bind(&user_id)
    .fetch_all(pool.get_ref())
    .await;
    
    match students {
        Ok(students) => {
            let response: Vec<StudentResponse> = students
                .into_iter()
                .map(StudentResponse::from)
                .collect();
            
            HttpResponse::Ok().json(response)
        }
        Err(e) => {
            error!("Error fetching students: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to fetch students"
            }))
        }
    }
}

pub async fn get_student(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    student_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Fetching student {} for user: {}", student_id, user_id);
    
    let student = sqlx::query_as::<_, Student>(
        "SELECT * FROM students WHERE id = $1 AND user_id = $2"
    )
    .bind(student_id.as_str())
    .bind(&user_id)
    .fetch_optional(pool.get_ref())
    .await;
    
    match student {
        Ok(Some(student)) => {
            HttpResponse::Ok().json(StudentResponse::from(student))
        }
        Ok(None) => {
            HttpResponse::NotFound().json(serde_json::json!({
                "error": "Student not found"
            }))
        }
        Err(e) => {
            error!("Error fetching student: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to fetch student"
            }))
        }
    }
}

pub async fn update_student(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    student_id: web::Path<String>,
    update_req: web::Json<UpdateStudentRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Updating student {} for user: {}", student_id, user_id);
    
    let exam_preferences = serde_json::to_string(&update_req.exam_preferences)
        .unwrap_or_else(|_| "[]".to_string());
    let now = Utc::now();
    
    let registration_date = update_req.registration_date.as_ref()
        .and_then(|d| NaiveDate::parse_from_str(d, "%Y-%m-%d").ok());
    
    let result = sqlx::query(
        r#"
        UPDATE students
        SET name = $1, phone = $2, email = $3, college_name = $4, address = $5, exam_preferences = $6, folder_id = $7, registration_date = $8, updated_at = $9
        WHERE id = $10 AND user_id = $11
        "#
    )
    .bind(&update_req.name)
    .bind(&update_req.phone)
    .bind(&update_req.email)
    .bind(&update_req.college_name)
    .bind(&update_req.address)
    .bind(&exam_preferences)
    .bind(&update_req.folder_id)
    .bind(registration_date)
    .bind(now)
    .bind(student_id.as_str())
    .bind(&user_id)
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(result) => {
            if result.rows_affected() == 0 {
                return HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Student not found"
                }));
            }
            
            info!("Student updated successfully: {}", student_id);
            
            // Fetch updated student
            let student = sqlx::query_as::<_, Student>(
                "SELECT * FROM students WHERE id = $1"
            )
            .bind(student_id.as_str())
            .fetch_one(pool.get_ref())
            .await;
            
            match student {
                Ok(student) => HttpResponse::Ok().json(StudentResponse::from(student)),
                Err(e) => {
                    error!("Error fetching updated student: {}", e);
                    HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Student updated but failed to fetch"
                    }))
                }
            }
        }
        Err(e) => {
            error!("Error updating student: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to update student"
            }))
        }
    }
}

pub async fn delete_student(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    student_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Deleting student {} for user: {}", student_id, user_id);
    
    let result = sqlx::query(
        "DELETE FROM students WHERE id = $1 AND user_id = $2"
    )
    .bind(student_id.as_str())
    .bind(&user_id)
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(result) => {
            if result.rows_affected() == 0 {
                return HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Student not found"
                }));
            }
            
            info!("Student deleted successfully: {}", student_id);
            HttpResponse::Ok().json(serde_json::json!({
                "message": "Student deleted successfully"
            }))
        }
        Err(e) => {
            error!("Error deleting student: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to delete student"
            }))
        }
    }
}

