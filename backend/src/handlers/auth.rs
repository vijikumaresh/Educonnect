use actix_web::{web, HttpResponse, HttpRequest};
use sqlx::PgPool;
use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey, Algorithm};
use chrono::{Utc, Duration};
use uuid::Uuid;
use log::{info, error, warn};

use crate::models::{User, RegisterRequest, LoginRequest, AuthResponse, Claims};

pub async fn register(
    pool: web::Data<PgPool>,
    req: web::Json<RegisterRequest>,
) -> HttpResponse {
    info!("Registration attempt for username: {}", req.username);
    
    // Check if username already exists
    let existing_user = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE username = $1"
    )
    .bind(&req.username)
    .fetch_optional(pool.get_ref())
    .await;
    
    match existing_user {
        Ok(Some(_)) => {
            info!("Username already exists: {}", req.username);
            return HttpResponse::Conflict().json(serde_json::json!({
                "error": "Username already exists"
            }));
        }
        Err(e) => {
            error!("Database error checking username: {}", e);
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Internal server error"
            }));
        }
        _ => {}
    }
    
    // Hash password
    let password_hash = match hash(&req.password, DEFAULT_COST) {
        Ok(hash) => hash,
        Err(e) => {
            error!("Error hashing password: {}", e);
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to process password"
            }));
        }
    };
    
    // Create user
    let user_id = Uuid::new_v4().to_string();
    let created_at = Utc::now();
    
    let result = sqlx::query(
        "INSERT INTO users (id, username, password_hash, created_at) VALUES ($1, $2, $3, $4)"
    )
    .bind(&user_id)
    .bind(&req.username)
    .bind(&password_hash)
    .bind(created_at)
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(_) => {
            info!("User registered successfully: {}", req.username);
            
            // Generate JWT token with enhanced security
            let jwt_secret = match std::env::var("JWT_SECRET") {
                Ok(secret) if secret.len() >= 32 => secret,
                Ok(secret) => {
                    warn!("JWT_SECRET is too short ({} chars). Minimum 32 characters recommended for security.", secret.len());
                    secret
                }
                Err(_) => {
                    error!("JWT_SECRET environment variable is not set! This is a security risk.");
                    return HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Server configuration error"
                    }));
                }
            };
            
            let now = Utc::now();
            let token_id = Uuid::new_v4().to_string();
            let claims = Claims {
                sub: user_id,
                username: req.username.clone(),
                exp: (now + Duration::hours(24)).timestamp() as usize,
                iat: now.timestamp() as usize,
                jti: token_id,
            };
            
            let mut header = Header::new(Algorithm::HS256);
            header.typ = Some("JWT".to_string());
            
            match encode(&header, &claims, &EncodingKey::from_secret(jwt_secret.as_bytes())) {
                Ok(token) => {
                    HttpResponse::Created().json(AuthResponse {
                        token,
                        username: req.username.clone(),
                    })
                }
                Err(e) => {
                    error!("Error generating token: {}", e);
                    HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Failed to generate token"
                    }))
                }
            }
        }
        Err(e) => {
            error!("Error creating user: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to create user"
            }))
        }
    }
}

pub async fn login(
    pool: web::Data<PgPool>,
    req: web::Json<LoginRequest>,
) -> HttpResponse {
    info!("Login attempt for username: {}", req.username);
    
    // Find user
    let user = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE username = $1"
    )
    .bind(&req.username)
    .fetch_optional(pool.get_ref())
    .await;
    
    let user = match user {
        Ok(Some(user)) => user,
        Ok(None) => {
            info!("User not found: {}", req.username);
            return HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid credentials"
            }));
        }
        Err(e) => {
            error!("Database error: {}", e);
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Internal server error"
            }));
        }
    };
    
    // Verify password
    match verify(&req.password, &user.password_hash) {
        Ok(true) => {
            info!("Login successful for user: {}", req.username);
            
            // Generate JWT token with enhanced security
            let jwt_secret = match std::env::var("JWT_SECRET") {
                Ok(secret) if secret.len() >= 32 => secret,
                Ok(secret) => {
                    warn!("JWT_SECRET is too short ({} chars). Minimum 32 characters recommended for security.", secret.len());
                    secret
                }
                Err(_) => {
                    error!("JWT_SECRET environment variable is not set! This is a security risk.");
                    return HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Server configuration error"
                    }));
                }
            };
            
            let now = Utc::now();
            let token_id = Uuid::new_v4().to_string();
            let claims = Claims {
                sub: user.id,
                username: user.username.clone(),
                exp: (now + Duration::hours(24)).timestamp() as usize,
                iat: now.timestamp() as usize,
                jti: token_id,
            };
            
            let mut header = Header::new(Algorithm::HS256);
            header.typ = Some("JWT".to_string());
            
            match encode(&header, &claims, &EncodingKey::from_secret(jwt_secret.as_bytes())) {
                Ok(token) => {
                    HttpResponse::Ok().json(AuthResponse {
                        token,
                        username: user.username,
                    })
                }
                Err(e) => {
                    error!("Error generating token: {}", e);
                    HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Failed to generate token"
                    }))
                }
            }
        }
        Ok(false) => {
            info!("Invalid password for user: {}", req.username);
            HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid credentials"
            }))
        }
        Err(e) => {
            error!("Error verifying password: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Internal server error"
            }))
        }
    }
}

pub fn extract_user_id(req: &HttpRequest) -> Result<String, HttpResponse> {
    let auth_header = req.headers().get("Authorization");
    
    let token = match auth_header {
        Some(header) => {
            let header_str = header.to_str().unwrap_or("");
            if header_str.starts_with("Bearer ") {
                &header_str[7..]
            } else {
                return Err(HttpResponse::Unauthorized().json(serde_json::json!({
                    "error": "Invalid authorization header"
                })));
            }
        }
        None => {
            return Err(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Missing authorization header"
            })));
        }
    };
    
    let jwt_secret = match std::env::var("JWT_SECRET") {
        Ok(secret) => secret,
        Err(_) => {
            error!("JWT_SECRET environment variable is not set! This is a security risk.");
            return Err(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Server configuration error"
            })));
        }
    };
    
    // Configure strict validation
    let mut validation = Validation::new(Algorithm::HS256);
    validation.validate_exp = true;
    validation.validate_nbf = false; // Not using nbf for now
    validation.leeway = 0; // No leeway for expiration
    
    match decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_bytes()),
        &validation
    ) {
        Ok(token_data) => {
            // Additional security check: verify token hasn't been tampered with
            let now = Utc::now().timestamp() as usize;
            if token_data.claims.exp < now {
                return Err(HttpResponse::Unauthorized().json(serde_json::json!({
                    "error": "Token has expired"
                })));
            }
            Ok(token_data.claims.sub)
        }
        Err(e) => {
            error!("Token validation failed: {}", e);
            Err(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid or expired token"
            })))
        }
    }
}

