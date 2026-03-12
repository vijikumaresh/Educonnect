use actix_web::{web, HttpResponse, HttpRequest};
use sqlx::PgPool;
use chrono::{Utc, NaiveDate};
use uuid::Uuid;
use log::{info, error};

use crate::models::{Seminar, CreateSeminarRequest, UpdateSeminarRequest, SeminarResponse};
use crate::handlers::auth::extract_user_id;

pub async fn get_all_seminars(
    pool: web::Data<PgPool>,
    req: HttpRequest,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query_as::<_, Seminar>(
        "SELECT * FROM seminars WHERE user_id = $1 ORDER BY seminar_date DESC"
    )
    .bind(&user_id)
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(seminars) => {
            let responses: Vec<SeminarResponse> = seminars.into_iter()
                .map(|s| s.into())
                .collect();
            HttpResponse::Ok().json(responses)
        }
        Err(e) => {
            error!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to fetch seminars"}))
        }
    }
}

pub async fn get_seminars_by_folder(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    folder_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query_as::<_, Seminar>(
        "SELECT * FROM seminars WHERE user_id = $1 AND folder_id = $2 ORDER BY seminar_date DESC"
    )
    .bind(&user_id)
    .bind(folder_id.as_str())
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(seminars) => {
            let responses: Vec<SeminarResponse> = seminars.into_iter()
                .map(|s| s.into())
                .collect();
            HttpResponse::Ok().json(responses)
        }
        Err(e) => {
            error!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to fetch seminars"}))
        }
    }
}

pub async fn create_seminar(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    seminar_req: web::Json<CreateSeminarRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    let seminar_date = match NaiveDate::parse_from_str(&seminar_req.seminar_date, "%Y-%m-%d") {
        Ok(date) => date,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({"error": "Invalid date format"})),
    };

    let id = Uuid::new_v4().to_string();
    let now = Utc::now();

    match sqlx::query_as::<_, Seminar>(
        r#"
        INSERT INTO seminars 
        (id, title, topic, participants_count, seminar_date, description, folder_id, user_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
        "#
    )
    .bind(&id)
    .bind(&seminar_req.title)
    .bind(&seminar_req.topic)
    .bind(seminar_req.participants_count)
    .bind(seminar_date)
    .bind(&seminar_req.description)
    .bind(&seminar_req.folder_id)
    .bind(&user_id)
    .bind(now)
    .bind(now)
    .fetch_one(pool.get_ref())
    .await
    {
        Ok(seminar) => {
            info!("Seminar created: {}", seminar.id);
            HttpResponse::Created().json(SeminarResponse::from(seminar))
        }
        Err(e) => {
            error!("Failed to create seminar: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to create seminar"}))
        }
    }
}

pub async fn update_seminar(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    seminar_id: web::Path<String>,
    seminar_req: web::Json<UpdateSeminarRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    let seminar_date = match NaiveDate::parse_from_str(&seminar_req.seminar_date, "%Y-%m-%d") {
        Ok(date) => date,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({"error": "Invalid date format"})),
    };

    let now = Utc::now();

    match sqlx::query_as::<_, Seminar>(
        r#"
        UPDATE seminars
        SET title = $1, topic = $2, participants_count = $3, seminar_date = $4, description = $5, updated_at = $6
        WHERE id = $7 AND user_id = $8
        RETURNING *
        "#
    )
    .bind(&seminar_req.title)
    .bind(&seminar_req.topic)
    .bind(seminar_req.participants_count)
    .bind(seminar_date)
    .bind(&seminar_req.description)
    .bind(now)
    .bind(seminar_id.as_str())
    .bind(&user_id)
    .fetch_one(pool.get_ref())
    .await
    {
        Ok(seminar) => HttpResponse::Ok().json(SeminarResponse::from(seminar)),
        Err(e) => {
            error!("Failed to update seminar: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to update seminar"}))
        }
    }
}

pub async fn delete_seminar(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    seminar_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query(
        "DELETE FROM seminars WHERE id = $1 AND user_id = $2"
    )
    .bind(seminar_id.as_str())
    .bind(&user_id)
    .execute(pool.get_ref())
    .await
    {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => {
            error!("Failed to delete seminar: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to delete seminar"}))
        }
    }
}

