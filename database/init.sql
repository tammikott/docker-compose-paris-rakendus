-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabel
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test andmed otammik jaoks
INSERT INTO todos (title, description) VALUES 
    ('Õpi Docker Compose', 'Multi-container rakendus minu jaoks'),
    ('Lõpeta oma kodunetöö', 'Labori ülesanded'),
    ('Rakenduse kontroll', 'Kontrolli et kõik töötab');
