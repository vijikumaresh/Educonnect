use actix_web::{web, HttpResponse, HttpRequest};
use sqlx::PgPool;
use chrono::Utc;
use uuid::Uuid;
use log::{info, error};

use crate::models::{Folder, CreateFolderRequest, UpdateFolderRequest};
use crate::handlers::auth::extract_user_id;

pub async fn create_folder(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    folder_req: web::Json<CreateFolderRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Creating folder '{}' for user: {}", folder_req.name, user_id);
    
    // If parent_id is provided, verify it exists and belongs to user
    if let Some(parent_id) = &folder_req.parent_id {
        let parent_exists = sqlx::query_as::<_, Folder>(
            "SELECT * FROM folders WHERE id = $1 AND user_id = $2"
        )
        .bind(parent_id)
        .bind(&user_id)
        .fetch_optional(pool.get_ref())
        .await;
        
        match parent_exists {
            Ok(None) => {
                return HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Parent folder not found"
                }));
            }
            Err(e) => {
                error!("Error checking parent folder: {}", e);
                return HttpResponse::InternalServerError().json(serde_json::json!({
                    "error": "Failed to verify parent folder"
                }));
            }
            _ => {}
        }
    }
    
    let folder_id = Uuid::new_v4().to_string();
    let now = Utc::now();
    
    let result = sqlx::query(
        r#"
        INSERT INTO folders (id, name, parent_id, user_id, created_at)
        VALUES ($1, $2, $3, $4, $5)
        "#
    )
    .bind(&folder_id)
    .bind(&folder_req.name)
    .bind(&folder_req.parent_id)
    .bind(&user_id)
    .bind(now)
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(_) => {
            info!("Folder created successfully: {}", folder_id);
            
            let folder = Folder {
                id: folder_id,
                name: folder_req.name.clone(),
                parent_id: folder_req.parent_id.clone(),
                user_id,
                created_at: now,
            };
            
            HttpResponse::Created().json(folder)
        }
        Err(e) => {
            error!("Error creating folder: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to create folder"
            }))
        }
    }
}

pub async fn get_folders(
    pool: web::Data<PgPool>,
    req: HttpRequest,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Fetching folders for user: {}", user_id);
    
    let folders = sqlx::query_as::<_, Folder>(
        "SELECT * FROM folders WHERE user_id = $1 ORDER BY created_at ASC"
    )
    .bind(&user_id)
    .fetch_all(pool.get_ref())
    .await;
    
    match folders {
        Ok(folders) => HttpResponse::Ok().json(folders),
        Err(e) => {
            error!("Error fetching folders: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to fetch folders"
            }))
        }
    }
}

pub async fn get_folder(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    folder_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Fetching folder {} for user: {}", folder_id, user_id);
    
    let folder = sqlx::query_as::<_, Folder>(
        "SELECT * FROM folders WHERE id = $1 AND user_id = $2"
    )
    .bind(folder_id.as_str())
    .bind(&user_id)
    .fetch_optional(pool.get_ref())
    .await;
    
    match folder {
        Ok(Some(folder)) => HttpResponse::Ok().json(folder),
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Folder not found"
        })),
        Err(e) => {
            error!("Error fetching folder: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to fetch folder"
            }))
        }
    }
}

pub async fn update_folder(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    folder_id: web::Path<String>,
    update_req: web::Json<UpdateFolderRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Updating folder {} for user: {}", folder_id, user_id);
    
    let result = sqlx::query(
        "UPDATE folders SET name = $1 WHERE id = $2 AND user_id = $3"
    )
    .bind(&update_req.name)
    .bind(folder_id.as_str())
    .bind(&user_id)
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(result) => {
            if result.rows_affected() == 0 {
                return HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Folder not found"
                }));
            }
            
            info!("Folder updated successfully: {}", folder_id);
            
            let folder = sqlx::query_as::<_, Folder>(
                "SELECT * FROM folders WHERE id = $1"
            )
            .bind(folder_id.as_str())
            .fetch_one(pool.get_ref())
            .await;
            
            match folder {
                Ok(folder) => HttpResponse::Ok().json(folder),
                Err(e) => {
                    error!("Error fetching updated folder: {}", e);
                    HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Folder updated but failed to fetch"
                    }))
                }
            }
        }
        Err(e) => {
            error!("Error updating folder: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to update folder"
            }))
        }
    }
}

pub async fn delete_folder(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    folder_id: web::Path<String>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Deleting folder {} for user: {}", folder_id, user_id);
    
    let result = sqlx::query(
        "DELETE FROM folders WHERE id = $1 AND user_id = $2"
    )
    .bind(folder_id.as_str())
    .bind(&user_id)
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(result) => {
            if result.rows_affected() == 0 {
                return HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Folder not found"
                }));
            }
            
            info!("Folder deleted successfully: {}", folder_id);
            HttpResponse::Ok().json(serde_json::json!({
                "message": "Folder deleted successfully"
            }))
        }
        Err(e) => {
            error!("Error deleting folder: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to delete folder"
            }))
        }
    }
}

#[derive(serde::Deserialize)]
pub struct MoveFolderRequest {
    pub parent_id: Option<String>,
}

pub async fn move_folder(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    folder_id: web::Path<String>,
    move_req: web::Json<MoveFolderRequest>,
) -> HttpResponse {
    let user_id = match extract_user_id(&req) {
        Ok(id) => id,
        Err(response) => return response,
    };
    
    info!("Moving folder {} to parent {:?} for user: {}", folder_id, move_req.parent_id, user_id);
    
    // Verify folder exists and belongs to user
    let folder_exists = sqlx::query_as::<_, Folder>(
        "SELECT * FROM folders WHERE id = $1 AND user_id = $2"
    )
    .bind(folder_id.as_str())
    .bind(&user_id)
    .fetch_optional(pool.get_ref())
    .await;
    
    match folder_exists {
        Ok(None) => {
            return HttpResponse::NotFound().json(serde_json::json!({
                "error": "Folder not found"
            }));
        }
        Err(e) => {
            error!("Error checking folder: {}", e);
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to verify folder"
            }));
        }
        _ => {}
    }
    
    // If parent_id is provided, verify it exists and belongs to user
    if let Some(parent_id) = &move_req.parent_id {
        let parent_exists = sqlx::query_as::<_, Folder>(
            "SELECT * FROM folders WHERE id = $1 AND user_id = $2"
        )
        .bind(parent_id)
        .bind(&user_id)
        .fetch_optional(pool.get_ref())
        .await;
        
        match parent_exists {
            Ok(None) => {
                return HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Parent folder not found"
                }));
            }
            Err(e) => {
                error!("Error checking parent folder: {}", e);
                return HttpResponse::InternalServerError().json(serde_json::json!({
                    "error": "Failed to verify parent folder"
                }));
            }
            _ => {}
        }
    }
    
    // Update folder's parent_id
    let result = sqlx::query(
        "UPDATE folders SET parent_id = $1 WHERE id = $2 AND user_id = $3"
    )
    .bind(&move_req.parent_id)
    .bind(folder_id.as_str())
    .bind(&user_id)
    .execute(pool.get_ref())
    .await;
    
    match result {
        Ok(result) => {
            if result.rows_affected() == 0 {
                return HttpResponse::NotFound().json(serde_json::json!({
                    "error": "Folder not found"
                }));
            }
            
            info!("Folder moved successfully: {}", folder_id);
            
            let folder = sqlx::query_as::<_, Folder>(
                "SELECT * FROM folders WHERE id = $1"
            )
            .bind(folder_id.as_str())
            .fetch_one(pool.get_ref())
            .await;
            
            match folder {
                Ok(folder) => HttpResponse::Ok().json(folder),
                Err(e) => {
                    error!("Error fetching moved folder: {}", e);
                    HttpResponse::InternalServerError().json(serde_json::json!({
                        "error": "Folder moved but failed to fetch"
                    }))
                }
            }
        }
        Err(e) => {
            error!("Error moving folder: {}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to move folder"
            }))
        }
    }
}


