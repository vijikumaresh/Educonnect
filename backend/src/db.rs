use sqlx::{PgPool, postgres::PgPoolOptions};
use log::info;

pub async fn create_pool(database_url: &str) -> Result<PgPool, sqlx::Error> {
    info!("Creating database connection pool...");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await?;
    
    info!("Database pool created successfully");
    Ok(pool)
}

pub async fn run_migrations(pool: &PgPool) -> Result<(), sqlx::Error> {
    info!("Running database migrations...");
    
    // Create users table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await?;
    
    // Create folders table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS folders (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            parent_id TEXT,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
        )
        "#,
    )
    .execute(pool)
    .await?;
    
    // Create students table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            college_name TEXT NOT NULL,
            address TEXT NOT NULL,
            exam_preferences TEXT NOT NULL,
            folder_id TEXT,
            registration_date DATE,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
        )
        "#,
    )
    .execute(pool)
    .await?;
    
    // Create seminars table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS seminars (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            topic TEXT NOT NULL,
            participants_count INTEGER NOT NULL DEFAULT 0,
            seminar_date DATE NOT NULL,
            description TEXT,
            folder_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
        )
        "#,
    )
    .execute(pool)
    .await?;
    
    // Create recruitment table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS recruitment_drives (
            id TEXT PRIMARY KEY NOT NULL,
            company_name TEXT NOT NULL,
            drive_date DATE NOT NULL,
            participants_count INTEGER NOT NULL DEFAULT 0,
            selected_count INTEGER NOT NULL DEFAULT 0,
            job_role TEXT,
            description TEXT,
            folder_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
        )
        "#,
    )
    .execute(pool)
    .await?;
    
    // Create book orders table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS book_orders (
            id TEXT PRIMARY KEY NOT NULL,
            book_title TEXT NOT NULL,
            author TEXT,
            academic_session TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0,
            order_date DATE NOT NULL,
            student_name TEXT,
            notes TEXT,
            folder_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
        )
        "#,
    )
    .execute(pool)
    .await?;
    
    info!("Database migrations completed successfully");
    Ok(())
}

