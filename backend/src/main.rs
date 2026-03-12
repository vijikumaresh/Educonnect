mod models;
mod db;
mod handlers;

use actix_web::{web, App, HttpResponse, HttpServer, middleware::Logger};
use actix_cors::Cors;
use dotenv::dotenv;
use log::info;
use std::env;
use tokio::time::{sleep, Duration};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables
    dotenv().ok();
    
    // Initialize logger
    env_logger::init();
    
    info!("Starting EduConnect Backend Server...");
    
    // Validate JWT_SECRET is set (security requirement)
    match env::var("JWT_SECRET") {
        Ok(secret) if secret.len() >= 32 => {
            info!("JWT_SECRET is configured (length: {} chars)", secret.len());
        }
        Ok(secret) => {
            log::warn!("JWT_SECRET is too short ({} chars). Minimum 32 characters recommended for security.", secret.len());
        }
        Err(_) => {
            log::error!("JWT_SECRET environment variable is not set! This is a critical security requirement.");
            log::error!("Please set JWT_SECRET before starting the server.");
            log::error!("Generate a secure secret: openssl rand -base64 32");
            std::process::exit(1);
        }
    }
    
    // Get configuration from environment
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://pc3@localhost/educonnect_app".to_string());
    let host = env::var("SERVER_HOST")
        .unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = env::var("SERVER_PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .unwrap_or(8080);
    
    // Create database connection pool with retry to handle startup race/network delays.
    let mut last_error: Option<sqlx::Error> = None;
    let pool = {
        let mut created_pool = None;
        for attempt in 1..=10 {
            match db::create_pool(&database_url).await {
                Ok(pool) => {
                    created_pool = Some(pool);
                    break;
                }
                Err(err) => {
                    log::warn!("Database connection attempt {attempt}/10 failed: {err}");
                    last_error = Some(err);
                    sleep(Duration::from_secs(3)).await;
                }
            }
        }

        match created_pool {
            Some(pool) => pool,
            None => {
                log::error!("Failed to create database pool after 10 attempts");
                if let Some(err) = last_error {
                    panic!("Failed to create database pool: {err}");
                }
                panic!("Failed to create database pool");
            }
        }
    };

    HttpServer::new(move || {
        // Build CORS policy per-worker to avoid capturing non-Send/non-Clone state.
        let cors = Cors::default()
            // Production origins
            .allowed_origin("https://registerstudents.kattral.ai")
            .allowed_origin("http://registerstudents.kattral.ai")
            .allowed_origin("https://registerstudentsapi.kattral.ai")
            .allowed_origin("http://registerstudentsapi.kattral.ai")
            // Development origins
            .allowed_origin("http://localhost:5173")
            .allowed_origin("http://localhost:5174")
            .allowed_origin("http://127.0.0.1:5173")
            .allowed_origin("http://127.0.0.1:5174")
            .allowed_origin_fn(|origin, _req_head| {
                let origin_str = origin.to_str().unwrap_or("");
                origin_str == "https://registerstudents.kattral.ai"
                    || origin_str == "http://registerstudents.kattral.ai"
                    || origin_str == "https://registerstudentsapi.kattral.ai"
                    || origin_str == "http://registerstudentsapi.kattral.ai"
                    || origin_str.starts_with("http://localhost:")
                    || origin_str.starts_with("http://127.0.0.1:")
            })
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::ACCEPT,
                actix_web::http::header::CONTENT_TYPE,
                actix_web::http::header::ORIGIN,
            ])
            .supports_credentials()
            .max_age(3600);

        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(Logger::default())
            .wrap(cors)
            // Root endpoint helps deployment checks and avoids confusing 404s on domain root.
            .route("/", web::get().to(|| async {
                HttpResponse::Ok().json(serde_json::json!({
                    "service": "educonnect-backend",
                    "status": "ok",
                    "health": "/health",
                    "api_base": "/api"
                }))
            }))
            // Browsers request favicon.ico by default; return empty success response.
            .route("/favicon.ico", web::get().to(|| async { HttpResponse::NoContent().finish() }))
            // Health check endpoint
            .route("/health", web::get().to(|| async { "OK" }))
            // Auth routes
            .service(
                web::scope("/api/auth")
                    .route("/register", web::post().to(handlers::auth::register))
                    .route("/login", web::post().to(handlers::auth::login))
            )
            // Student routes
            .service(
                web::scope("/api/students")
                    .route("", web::get().to(handlers::students::get_students))
                    .route("", web::post().to(handlers::students::create_student))
                    .route("/{id}", web::get().to(handlers::students::get_student))
                    .route("/{id}", web::put().to(handlers::students::update_student))
                    .route("/{id}", web::delete().to(handlers::students::delete_student))
            )
            // Folder routes
            .service(
                web::scope("/api/folders")
                    .route("", web::get().to(handlers::folders::get_folders))
                    .route("", web::post().to(handlers::folders::create_folder))
                    .route("/{id}", web::get().to(handlers::folders::get_folder))
                    .route("/{id}", web::put().to(handlers::folders::update_folder))
                    .route("/{id}/move", web::put().to(handlers::folders::move_folder))
                    .route("/{id}", web::delete().to(handlers::folders::delete_folder))
            )
            // Seminar routes
            .service(
                web::scope("/api/seminars")
                    .route("", web::get().to(handlers::seminars::get_all_seminars))
                    .route("", web::post().to(handlers::seminars::create_seminar))
                    .route("/folder/{folder_id}", web::get().to(handlers::seminars::get_seminars_by_folder))
                    .route("/{id}", web::put().to(handlers::seminars::update_seminar))
                    .route("/{id}", web::delete().to(handlers::seminars::delete_seminar))
            )
            // Recruitment routes
            .service(
                web::scope("/api/recruitment")
                    .route("", web::get().to(handlers::recruitment::get_all_recruitment))
                    .route("", web::post().to(handlers::recruitment::create_recruitment))
                    .route("/folder/{folder_id}", web::get().to(handlers::recruitment::get_recruitment_by_folder))
                    .route("/{id}", web::put().to(handlers::recruitment::update_recruitment))
                    .route("/{id}", web::delete().to(handlers::recruitment::delete_recruitment))
            )
            // Book Orders routes
            .service(
                web::scope("/api/book-orders")
                    .route("", web::get().to(handlers::book_orders::get_all_book_orders))
                    .route("", web::post().to(handlers::book_orders::create_book_order))
                    .route("/folder/{folder_id}", web::get().to(handlers::book_orders::get_book_orders_by_folder))
                    .route("/{id}", web::put().to(handlers::book_orders::update_book_order))
                    .route("/{id}", web::delete().to(handlers::book_orders::delete_book_order))
            )
    })
    .bind((host, port))?
    .run()
    .await
}

