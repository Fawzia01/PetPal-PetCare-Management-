-- Create user_api_settings table for storing Groq API configurations
CREATE TABLE IF NOT EXISTS user_api_settings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    groq_api_key TEXT,
    groq_model VARCHAR(100) DEFAULT 'llama-3.3-70b-versatile',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_api_settings_user_id ON user_api_settings(user_id);
