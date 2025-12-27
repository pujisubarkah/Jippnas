-- Script SQL untuk membuat tabel-tabel instrumen survey di PostgreSQL
-- Jalankan script ini di Navicat atau pgAdmin

-- Tabel utama instrumen survey/kuesioner
CREATE TABLE survey_instruments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel aspek dalam instrumen survey
CREATE TABLE instrument_aspects (
    id SERIAL PRIMARY KEY,
    instrument_id INTEGER REFERENCES survey_instruments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel pertanyaan dalam aspek
CREATE TABLE instrument_questions (
    id SERIAL PRIMARY KEY,
    aspect_id INTEGER REFERENCES instrument_aspects(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'single', -- 'single' atau 'multiple'
    is_required BOOLEAN DEFAULT true,
    require_evidence BOOLEAN DEFAULT false,
    evidence_label VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel pilihan jawaban dengan skor
CREATE TABLE question_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES instrument_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    option_value VARCHAR(10), -- 'a', 'b', 'c', dll
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel responden instrumen
CREATE TABLE instrument_responses (
    id SERIAL PRIMARY KEY,
    instrument_id INTEGER REFERENCES survey_instruments(id) ON DELETE CASCADE,
    instansi VARCHAR(255) NOT NULL,
    total_score INTEGER DEFAULT 0,
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel jawaban responden
CREATE TABLE response_answers (
    id SERIAL PRIMARY KEY,
    response_id INTEGER REFERENCES instrument_responses(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES instrument_questions(id) ON DELETE CASCADE,
    selected_option_ids INTEGER[], -- Array of option IDs untuk multiple choice
    selected_option_id INTEGER REFERENCES question_options(id), -- Untuk single choice
    evidence TEXT, -- Bukti dukung
    original_score INTEGER DEFAULT 0,
    verified_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel verifikasi jawaban
CREATE TABLE answer_verifications (
    id SERIAL PRIMARY KEY,
    answer_id INTEGER REFERENCES response_answers(id) ON DELETE CASCADE,
    verified_option_ids INTEGER[], -- Array of verified option IDs
    verified_option_id INTEGER REFERENCES question_options(id), -- Verified single choice
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verification_note TEXT,
    verified_by INTEGER, -- User ID verifikator
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes untuk performa
CREATE INDEX idx_instruments_is_active ON survey_instruments(is_active);
CREATE INDEX idx_responses_instrument_id ON instrument_responses(instrument_id);
CREATE INDEX idx_responses_verification_status ON instrument_responses(verification_status);
CREATE INDEX idx_answers_response_id ON response_answers(response_id);
CREATE INDEX idx_answers_question_id ON response_answers(question_id);
CREATE INDEX idx_verifications_answer_id ON answer_verifications(answer_id);

-- Trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_instruments_updated_at BEFORE UPDATE ON survey_instruments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();