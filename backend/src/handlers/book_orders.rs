use actix_web::{web, HttpResponse, HttpRequest};
use sqlx::PgPool;
use chrono::{Utc, NaiveDate};
use uuid::Uuid;
use log::{info, error};

use crate::models::{BookOrder, CreateBookOrderRequest, UpdateBookOrderRequest, BookOrderResponse};
use crate::handlers::auth::extract_user_id;

pub async fn get_all_book_orders(
    pool: web::Data<PgPool>,
    req: HttpRequest,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query_as::<_, BookOrder>(
        "SELECT * FROM book_orders WHERE user_id = $1 ORDER BY order_date DESC"
    )
    .bind(&user_id)
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(orders) => {
            let responses: Vec<BookOrderResponse> = orders.into_iter()
                .map(|o| o.into())
                .collect();
            HttpResponse::Ok().json(responses)
        }
        Err(e) => {
            error!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to fetch book orders"}))
        }
    }
}

pub async fn get_book_orders_by_folder(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    folder_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query_as::<_, BookOrder>(
        "SELECT * FROM book_orders WHERE user_id = $1 AND folder_id = $2 ORDER BY order_date DESC"
    )
    .bind(&user_id)
    .bind(folder_id.as_str())
    .fetch_all(pool.get_ref())
    .await
    {
        Ok(orders) => {
            let responses: Vec<BookOrderResponse> = orders.into_iter()
                .map(|o| o.into())
                .collect();
            HttpResponse::Ok().json(responses)
        }
        Err(e) => {
            error!("Database error: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to fetch book orders"}))
        }
    }
}

pub async fn create_book_order(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    order_req: web::Json<CreateBookOrderRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    let order_date = match NaiveDate::parse_from_str(&order_req.order_date, "%Y-%m-%d") {
        Ok(date) => date,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({"error": "Invalid date format"})),
    };

    let id = Uuid::new_v4().to_string();
    let now = Utc::now();

    match sqlx::query_as::<_, BookOrder>(
        r#"
        INSERT INTO book_orders 
        (id, book_title, author, academic_session, quantity, order_date, student_name, notes, folder_id, user_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
        "#
    )
    .bind(&id)
    .bind(&order_req.book_title)
    .bind(&order_req.author)
    .bind(&order_req.academic_session)
    .bind(order_req.quantity)
    .bind(order_date)
    .bind(&order_req.student_name)
    .bind(&order_req.notes)
    .bind(&order_req.folder_id)
    .bind(&user_id)
    .bind(now)
    .bind(now)
    .fetch_one(pool.get_ref())
    .await
    {
        Ok(order) => {
            info!("Book order created: {}", order.id);
            HttpResponse::Created().json(BookOrderResponse::from(order))
        }
        Err(e) => {
            error!("Failed to create book order: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to create book order"}))
        }
    }
}

pub async fn update_book_order(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    order_id: web::Path<String>,
    order_req: web::Json<UpdateBookOrderRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    let order_date = match NaiveDate::parse_from_str(&order_req.order_date, "%Y-%m-%d") {
        Ok(date) => date,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({"error": "Invalid date format"})),
    };

    let now = Utc::now();

    match sqlx::query_as::<_, BookOrder>(
        r#"
        UPDATE book_orders
        SET book_title = $1, author = $2, academic_session = $3, quantity = $4, 
            order_date = $5, student_name = $6, notes = $7, updated_at = $8
        WHERE id = $9 AND user_id = $10
        RETURNING *
        "#
    )
    .bind(&order_req.book_title)
    .bind(&order_req.author)
    .bind(&order_req.academic_session)
    .bind(order_req.quantity)
    .bind(order_date)
    .bind(&order_req.student_name)
    .bind(&order_req.notes)
    .bind(now)
    .bind(order_id.as_str())
    .bind(&user_id)
    .fetch_one(pool.get_ref())
    .await
    {
        Ok(order) => HttpResponse::Ok().json(BookOrderResponse::from(order)),
        Err(e) => {
            error!("Failed to update book order: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to update book order"}))
        }
    }
}

pub async fn delete_book_order(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    order_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };

    match sqlx::query(
        "DELETE FROM book_orders WHERE id = $1 AND user_id = $2"
    )
    .bind(order_id.as_str())
    .bind(&user_id)
    .execute(pool.get_ref())
    .await
    {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(e) => {
            error!("Failed to delete book order: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Failed to delete book order"}))
        }
    }
}

