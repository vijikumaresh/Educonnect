use actix_web::{web, HttpResponse, HttpRequest};
use sqlx::PgPool;
use chrono::{Utc, NaiveDate};
use uuid::Uuid;
use log::{info, error};

use crate::models::{RecruitmentDrive, CreateRecruitmentRequest, UpdateRecruitmentRequest, RecruitmentResponse};
use crate::handlers::auth::extract_user_id;

pub async fn get_all_recruitment(
    pool: web::Data<PgPool>,
    req: HttpRequest,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query_as::<_, RecruitmentDrive>(
        "SELECT * FROM recruitment_drives WHERE user_id = $1 ORDER BY drive_date DESC"
    )
    .bind(&user_id)
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(drives) => {
            let responses: Vec<RecruitmentResponse> = drives.into_iter()
                .map(|d| d.into())
                .collect();
            HttpResponse::Ok().json(responses)
        }
        Err(e) => {
            error!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to fetch recruitment drives"}))
        }
    }
}

pub async fn get_recruitment_by_folder(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    folder_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query_as::<_, RecruitmentDrive>(
        "SELECT * FROM recruitment_drives WHERE user_id = $1 AND folder_id = $2 ORDER BY drive_date DESC"
    )
    .bind(&user_id)
    .bind(folder_id.as_str())
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(drives) => {
            let responses: Vec<RecruitmentResponse> = drives.into_iter()
                .map(|d| d.into())
                .collect();
            HttpResponse::Ok().json(responses)
        }
        Err(e) => {
            error!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to fetch recruitment drives"}))
        }
    }
}

pub async fn create_recruitment(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    recruitment_req: web::Json<CreateRecruitmentRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    let drive_date = match NaiveDate::parse_from_str(&recruitment_req.drive_date, "%Y-%m-%d") {
        Ok(date) => date,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({"error": "Invalid date format"})),
    };

    let id = Uuid::new_v4().to_string();
    let now = Utc::now();

    match sqlx::query_as::<_, RecruitmentDrive>(
        r#"
        INSERT INTO recruitment_drives 
        (id, company_name, drive_date, participants_count, selected_count, job_role, description, folder_id, user_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
        "#
    )
    .bind(&id)
    .bind(&recruitment_req.company_name)
    .bind(drive_date)
    .bind(recruitment_req.participants_count)
    .bind(recruitment_req.selected_count)
    .bind(&recruitment_req.job_role)
    .bind(&recruitment_req.description)
    .bind(&recruitment_req.folder_id)
    .bind(&user_id)
    .bind(now)
    .bind(now)
    .fetch_one(pool.get_ref())
    .await
    {
        Ok(drive) => {
            info!("Recruitment drive created: {}", drive.id);
            HttpResponse::Created().json(RecruitmentResponse::from(drive))
        }
        Err(e) => {
            error!("Failed to create recruitment drive: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to create recruitment drive"}))
        }
    }
}

pub async fn update_recruitment(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    recruitment_id: web::Path<String>,
    recruitment_req: web::Json<UpdateRecruitmentRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    let drive_date = match NaiveDate::parse_from_str(&recruitment_req.drive_date, "%Y-%m-%d") {
        Ok(date) => date,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({"error": "Invalid date format"})),
    };

    let now = Utc::now();

    match sqlx::query_as::<_, RecruitmentDrive>(
        r#"
        UPDATE recruitment_drives
        SET company_name = $1, drive_date = $2, participants_count = $3, selected_count = $4, 
            job_role = $5, description = $6, updated_at = $7
        WHERE id = $8 AND user_id = $9
        RETURNING *
        "#
    )
    .bind(&recruitment_req.company_name)
    .bind(drive_date)
    .bind(recruitment_req.participants_count)
    .bind(recruitment_req.selected_count)
    .bind(&recruitment_req.job_role)
    .bind(&recruitment_req.description)
    .bind(now)
    .bind(recruitment_id.as_str())
    .bind(&user_id)
    .fetch_one(pool.get_ref())
    .await
    {
        Ok(drive) => HttpResponse::Ok().json(RecruitmentResponse::from(drive)),
        Err(e) => {
            error!("Failed to update recruitment drive: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to update recruitment drive"}))
        }
    }
}

pub async fn delete_recruitment(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    recruitment_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query(
        "DELETE FROM recruitment_drives WHERE id = $1 AND user_id = $2"
    )
    .bind(recruitment_id.as_str())
    .bind(&user_id)
    .execute(pool.get_ref())
    .await
    {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => {
            error!("Failed to delete recruitment drive: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to delete recruitment drive"}))
        }
    }
}

